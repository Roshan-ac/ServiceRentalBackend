import router from "..";

router.get("/", (req, res) => {
  res.send("Hello World");
});

export default router;
