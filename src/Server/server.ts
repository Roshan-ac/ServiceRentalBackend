import app from './app';
require("dotenv").config();
const port = process.env.PORT || 9000;
app.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`Server Rental Running : http://localhost:${port}`);
  /* eslint-enable no-console */
});