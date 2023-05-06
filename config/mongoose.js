const env = require("./environment");
const mongoose = require("mongoose");

mongoose.set("strictQuery", true);

main().catch((err) => console.log(err));

// connect mongoose to mongoDB
async function main() {
  await mongoose.connect(
    `mongodb://${env.mongodb_domain_name}:${env.mongodb_port}/${env.db_name}`,
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    }
  );

  console.log("successfully connected to db");
}
