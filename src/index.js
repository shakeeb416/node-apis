const app = require("./app");
const { port } = require("./config");

const PORT = port || 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
