const fs = require("fs")
const path = require("path")

const generatedConfig = path.join(__dirname, ".cache", "typegen", "graphql.config.json")
const fallbackSchema = path.join(__dirname, ".cache", "schema.gql")

module.exports = fs.existsSync(generatedConfig)
  ? require(generatedConfig)
  : {
      schema: fs.existsSync(fallbackSchema) ? fallbackSchema : undefined,
      documents: ["src/**/*.{js,jsx,ts,tsx}"],
    }
