// const net = require("net");
// const Parser = require("redis-parser");

// const store = {};
// const server = net.createServer((connection) => {
//   console.log("client connected ..");

//   connection.on("data", (data) => {
//     const parser = new Parser({
//       returnReply: (reply) => {
//         // console.log("-->", reply+);
//         const command = reply[0];
//         switch (command) {
//           case "set":
//             {
//               const key = reply[1];
//               const value = reply[2];
//               store[key] = value;
//               connection.write("+OK\r\n");
//             }
//             break;

//           case "get": {
//             const key = reply[1];
//             const value = store[key];
//             // connection.write(value);
//             if (!value) {
//               connection.write("$-1\r\n");
//             } else {
//               connection.write(`$${value.length}\r\n${value}\r\n`);
//             }
//           }
//         }
//       },
//       returnError: (err) => {
//         console.log(err);
//       },
//     });
//     parser.execute(data);
//     // console.log("-->", data.toString());
//   });
// });

// server.listen(8000, () => {
//   console.log(" Custom Server running on port :8000");
// });
const net = require("net");
const Parser = require("redis-parser");

const store = {};
const server = net.createServer((connection) => {
  console.log("client connected ..");

  const parser = new Parser({
    returnReply: (reply) => {
      const command = reply[0];
      switch (command) {
        case "set":
          {
            const key = reply[1];
            const value = reply[2];
            store[key] = value;
            connection.write("+OK\r\n"); // Respond to SET command
          }
          break;

        case "get": {
          const key = reply[1];
          const value = store[key];
          if (value === undefined) {
            connection.write("$-1\r\n"); // Key does not exist
          } else {
            connection.write(`$${value.length}\r\n${value}\r\n`); // Return the value
          }
          break; // Add a break statement here
        }
        default:
          connection.write("-ERR unknown command\r\n"); // Handle unknown commands
          break;
      }
    },
    returnError: (err) => {
      console.log(err);
    },
  });

  connection.on("data", (data) => {
    parser.execute(data); // Execute parsing for incoming data
  });

  connection.on("end", () => {
    console.log("Client disconnected...");
  });

  connection.on("error", (err) => {
    console.error("Connection error:", err);
  });
});

server.listen(8000, () => {
  console.log("Custom Server running on port: 8000");
});
