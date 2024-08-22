const { getUsers } = require("../controllers/users");
const router = require("express").Router();

router.get("/", getUsers);
router.get("/:userID", () => console.log("GET users by ID"));
router.post("/", () => console.log("POST users"));

module.exports = router;
