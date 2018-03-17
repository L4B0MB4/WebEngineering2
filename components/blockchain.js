import crypto from "crypto";

export class Blockchain {
  constructor() {
    this.current_transactions = [];
    this.chain = [];
    this.nodes = new Set();
    this.new_block(100, "1");
    this.public_adress;
  }

  mine(transaction) {
    let last_block = this.chain[this.chain.length - 1];
    let proof = this.proof_of_work(last_block);
    let reward = this.create_transaction(0, this.public_adress,"reward", { coins: 1 });
    this.current_transactions.push(...[transaction, reward]);
    let previous_hash = this.hash(JSON.stringify(last_block));
    let block = this.new_block(proof, previous_hash);
    return block;
  }

  register_node(address) {
    this.nodes.add(address);
  }

  create_transaction(sender, recipient, type, data) {
    let timestamp =(new Date()).getTime();
    return {
      sender,
      recipient,
      value: {
        type,
        data,
        timestamp,
        hash:this.hash(JSON.stringify({type,data,timestamp})),
      }
    };
  }

  new_block(proof, previous_hash) {
    let block = {
      index: this.chain.length,
      timestamp: new Date(Date.now()).toISOString(),
      transactions: this.current_transactions,
      proof,
      previous_hash: previous_hash
        ? previous_hash
        : this.hash(this.chain[this.chain.length - 1])
    };

    this.current_transactions = [];
    this.chain.push(block);
    return block;
  }

  proof_of_work(last_block) {
    let last_proof = last_block.proof;
    let last_hash = this.hash(JSON.stringify(last_block));

    let proof = 0;
    while (this.valid_proof(last_proof, proof, last_hash) !== true)
      proof += parseInt(Math.random() * 10 + 1);

    return proof;
  }

  hash(block) {
    return crypto
      .createHash("sha256")
      .update(block)
      .digest("hex");
  }

  valid_proof(last_proof, proof, last_hash) {
    let guess = `${last_proof}${proof}${last_hash}`;
    let guess_hash = this.hash(guess);
    return guess_hash.startsWith("0000");
  }

  valid_chain(chain) {
    console.log("chain length: " + chain.length);
    if (chain.length <= 0) return false;
    let last_block = chain[0];
    let current_index = 1;

    while (current_index < chain.length) {
      let block = chain[current_index];
      if (block.previous_hash !== this.hash(JSON.stringify(last_block))) {
        return false;
      }

      if (
        !this.valid_proof(
          last_block.proof,
          block.proof,
          this.hash(JSON.stringify(last_block))
        )
      ) {
        return false;
      }

      last_block = block;
      current_index++;
    }

    return true;
  }

  async resolve_conflicts() {
    let neighbours = [...this.nodes];
    let new_chain = undefined;
    const config = {
      method: "GET",
      headers: {
        "content-type": "application/json"
      }
    };
    let max_length = this.chain.length;
    for (let i = 0; i < neighbours.length; i++) {
      let node = neighbours[i];
      const res = await fetch(`${node}/chain`, config);
      const node_chain = await res.json();
      if (node_chain.length > max_length && this.valid_chain(node_chain)) {
        max_length = node_chain.length;
        new_chain = node_chain;
      }
    }
    if (new_chain !== undefined) {
      this.chain = new_chain;
      return true;
    }
    return false;
  }
}
