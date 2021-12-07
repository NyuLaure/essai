const express = require("express");

const app = express();
app.use(express.json());
const mongoose = require("mongoose");

const Thing = require("./models/Thing");

const saucesRoutes = require("./routes/sauces");

app.use("/api/sauces", saucesRoutes);

app.get((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Header",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

mongoose.connect(
  "mongodb+srv://Laure:mongodb@cluster0.ydhcx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (!err) console.log("MongoDB Connécté");
    else console.log("Connexion echouée : " + err);
  }
);

app.get("/api/sauces", (req, res, next) => {
  const sauces = [
    {
      userId:
        "string - Identifiant MongoDB unique de l'utilisateur qui à créé la sauce",
      name: "string - nom de la sauce",
      manufacturer: "string - fabriquant de la sauce",
      description: "string - description de la sauce",
      mainPepper: "string - principal ingrédient épicé de la sauce",
      imageUrl: "string - URL de l image de la sauce dl par l utilisateur",
      heat: "number - entre 1 et 10 décrivant la sauce",
      likes: "number - utilisateurs qui aiment",
      dislikes: "number - utilisateurs qui n aiment pas",
      usersLiked:
        "string<userID> - tableau des id des utilisateurs qui ont aimés la sauce",
      usersDisliked: "string<userId> - tableau des id qui n ont pas aimés",
    },
  ];
  res.status(200).json(sauces);
});
app.use("/api/sauces", (req, res, next) => {
  Thing.find()
    .then((things) => res.status(200).json(things))
    .catch((error) => res.status(400).json({ error }));
});

app.post("/api/auth/signup", (req, res, next) => {
  console.log(req.body);
  res.status(201).json({
    message: "Vous avez bien été ajouté à la base de donnée !",
  });
});

app.post("/api/auth/login", (req, res, next) => {
  console.log(req.body);
  res.status(201).json({
    message: "Vos informations ont étés vérifiées !",
  });
});

app.post("/api/sauces", (req, res, next) => {
  delete req.body._id;
  const thing = new Thing({
    ...req.body,
  });
  thing
    .save()
    .then(() =>
      res.status(201).json({ message: "Nouvelle sauce enregistrée !" })
    )
    .catch((error) => res.status(400).json({ error }));
});

app.get("/api/sauces/:id", (req, res, next) => {
  Thing.findOne({ _id: req.params.id })
    .then((thing) => res.status(200).json(thing))
    .catch((error) => res.status(404).json({ error }));
});

app.put("/api/sauces/:id", (req, res, next) => {
  Thing.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
    .catch((error) => res.status(400).json({ error }));
});

app.delete("/api/sauces/:id", (req, res, next) => {
  Thing.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: "Sauce supprimée !" }))
    .catch((error) => res.status(400).json({ error }));
});
module.exports = app;
