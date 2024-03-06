import ReadLine from "readline";
import { ask } from "./app.js";
var rl = ReadLine.createInterface(process.stdin, process.stdout);
rl.setPrompt("Hi! Ask me anything!\n");
rl.prompt();
rl.on("line", function (line) {
  if (line === "exit") rl.close();
  // ask LLM
  ask(line)
    .then((data) => {
      rl.setPrompt(data + "\nAsk more or type exit to close.\n");
      rl.prompt();
    })
    .catch((err) => {
      console.log("Exited with error", err);
      rl.close();
    });
}).on("close", function () {
  process.exit(0);
});
