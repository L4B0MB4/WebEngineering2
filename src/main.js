import express from "express";
import bodyParser from "body-parser";
import fetch from 'isomorphic-unfetch';

const app = express();
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true
  })
);
const blockchain = new Blockchain();
const node_identifier = "43b2b584-507d-4292-a773-71bab1cc1116";

app.get("/mine", async (req, res) => {
  await blockchain.resolve_conflicts();
  let last_block = blockchain.chain[blockchain.chain.length - 1];
  let proof = blockchain.proof_of_work(last_block);
  blockchain.new_transaction(0, node_identifier, 1);
  let previous_hash = blockchain.hash(JSON.stringify(last_block));
  let block = blockchain.new_block(proof, previous_hash);
  res.json(block);
});

app.get("/chain", (req, res) => {
  res.json(blockchain.chain);
});

app.post("/transactions/new", (req, res) => {
  let transaction = req.body;
  if (!(transaction.sender && transaction.recipient && transaction.amount))
    return res.json({ message: " Values are missing! " });

  let index = blockchain.new_transaction(
    transaction.sender,
    transaction.recipient,
    transaction.amount
  );

  res.json({ message: `Transaction will be added to block ${index}` });
});

app.post("/nodes/register",(req,res)=>
{
  let node = req.body.node;
  if(!node) return res.json({message:"You have to pass a node url"});
  blockchain.register_node(node);
  return res.json({message:"Node added",nodes:blockchain.nodes});
});

app.get("/nodes/resolve",async (req,res)=>
{
    let replaced = await blockchain.resolve_conflicts();
    return res.json({replaced})
})

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(8081, () => console.log("Magic is happening on on port 8080!"));
