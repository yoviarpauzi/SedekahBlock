import app from "./src/router";
import { port } from "./src/utils/environment";

app.listen(port, () => {
  console.log(`server running at : http://127.0.0.1:${port}`);
});
