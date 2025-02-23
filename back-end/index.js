require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./config/mysql/database");
const corsOptions = require("./config/corsOptions");
const authRoutes = require("./routes/authRoutes");
const metricsRoutes = require("./routes/metricsRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const comandasRoutes = require("./routes/comandasRoutes");
const logRoutes = require("./routes/logRoutes");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT;

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());

// Rotas
app.use("/auth", authRoutes);
app.use("/metrics", metricsRoutes);
app.use("/categories", categoryRoutes);
app.use("/stock", productRoutes);
app.use("/comandas", comandasRoutes);
app.use("/log", logRoutes);

// Review
app.post('/submit-form', async (req, res) => {
  const data = req.body;
  const scriptUrl = `https://script.google.com/macros/s/${process.env.SCRIPT_ID}/exec`;

  try {
    const response = await axios.post(scriptUrl, data, {
      headers: { 'Content-Type': 'application/json' }
    });

    res.status(200).json({ message: 'Dados enviados com sucesso', response: response.data });
  } catch (error) {
    console.error('Erro ao enviar para o script:', error);
    res.status(500).json({ message: 'Erro ao enviar os dados', error: error.message });
  }
});

// Testar conexão com o banco de dados
sequelize
  .authenticate()
  .then(() => console.log("Banco conectado com sucesso!"))
  .catch((err) => console.error("Erro ao conectar no banco:", err));

// Adicionando uma rota para a raiz
app.get("/", (req, res) => {
  res.send("Servidor está funcionando!");
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
