class Node {
    constructor(word) {
        this.word = word; // Store the word
        this.value = word.charCodeAt(0); // ASCII value of the first character
        this.left = null;
        this.right = null;
        this.height = 1;
        this.x = 0;
        this.y = 0;
    }
}

class AVLTree {
    constructor() {
        this.root = null;
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
    }

    getHeight(node) {
        return node ? node.height : 0;
    }

    getBalanceFactor(node) {
        return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;
    }

    rightRotate(y) {
        const x = y.left;
        const T2 = x.right;

        x.right = y;
        y.left = T2;

        y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;
        x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;

        return x;
    }

    leftRotate(x) {
        const y = x.right;
        const T2 = y.left;

        y.left = x;
        x.right = T2;

        x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;
        y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;

        return y;
    }

    compareWords(word1, word2) {
        let i = 0;
        while (i < word1.length && i < word2.length) {
            if (word1.charCodeAt(i) < word2.charCodeAt(i)) return -1;
            if (word1.charCodeAt(i) > word2.charCodeAt(i)) return 1;
            i++;
        }
        if (word1.length < word2.length) return -1;
        if (word1.length > word2.length) return 1;
        return 0;
    }

    insert(node, word) {
        if (!node) return new Node(word);

        const comparison = this.compareWords(word, node.word);
        if (comparison < 0) {
            node.left = this.insert(node.left, word);
        } else if (comparison > 0) {
            node.right = this.insert(node.right, word);
        } else {
            return node; // Duplicate words are not allowed
        }

        node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
        const balance = this.getBalanceFactor(node);

        if (balance > 1 && this.compareWords(word, node.left.word) < 0) return this.rightRotate(node);
        if (balance < -1 && this.compareWords(word, node.right.word) > 0) return this.leftRotate(node);
        if (balance > 1 && this.compareWords(word, node.left.word) > 0) {
            node.left = this.leftRotate(node.left);
            return this.rightRotate(node);
        }
        if (balance < -1 && this.compareWords(word, node.right.word) < 0) {
            node.right = this.rightRotate(node.right);
            return this.leftRotate(node);
        }

        return node;
    }

    delete(node, word) {
        if (!node) return node;

        const comparison = this.compareWords(word, node.word);
        if (comparison < 0) {
            node.left = this.delete(node.left, word);
        } else if (comparison > 0) {
            node.right = this.delete(node.right, word);
        } else {
            if (!node.left || !node.right) {
                node = node.left ? node.left : node.right;
            } else {
                const minValueNode = this.getMinValueNode(node.right);
                node.word = minValueNode.word;
                node.value = minValueNode.value;
                node.right = this.delete(node.right, minValueNode.word);
            }
        }

        if (!node) return node;

        node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
        const balance = this.getBalanceFactor(node);

        if (balance > 1 && this.getBalanceFactor(node.left) >= 0) return this.rightRotate(node);
        if (balance > 1 && this.getBalanceFactor(node.left) < 0) {
            node.left = this.leftRotate(node.left);
            return this.rightRotate(node);
        }
        if (balance < -1 && this.getBalanceFactor(node.right) <= 0) return this.leftRotate(node);
        if (balance < -1 && this.getBalanceFactor(node.right) > 0) {
            node.right = this.rightRotate(node.right);
            return this.leftRotate(node);
        }

        return node;
    }

    getMinValueNode(node) {
        let current = node;
        while (current.left) {
            current = current.left;
        }
        return current;
    }

    search(node, word) {
        if (!node) return null;
        const comparison = this.compareWords(word, node.word);
        if (comparison === 0) return node;
        return comparison < 0 ? this.search(node.left, word) : this.search(node.right, word);
    }

    inOrder(cb, root = this.root) {
        if (!root) return;
        this.inOrder(cb, root.left);
        cb(root);
        this.inOrder(cb, root.right);
    }

    drawTree(node, x, y, dx) {
        if (node) {
            node.x = x;
            node.y = y;
            this.drawTree(node.left, x - dx, y + 60, dx / 2);
            this.drawTree(node.right, x + dx, y + 60, dx / 2);
        }
    }

    drawNode(node) {
        if (!node) return;
        const depth = Math.floor(node.y / 60);
        const colors = ["#FF5733", "#008000", "#3357FF", "#FFD433", "#D433FF", "#33FFF5"];
        const color = colors[depth % colors.length];

        // Draw the node as a rectangle
        this.ctx.fillStyle = color;
        this.ctx.fillRect(node.x - 30, node.y - 20, 60, 40);
        this.ctx.strokeRect(node.x - 30, node.y - 20, 60, 40);

        // Draw the word inside the node
        this.ctx.fillStyle = "black";
        this.ctx.font = "16px Arial";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText(node.word, node.x, node.y);

        // Draw the balance factor in a small square
        const balance = this.getBalanceFactor(node);
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(node.x + 25, node.y - 25, 20, 20);
        this.ctx.strokeRect(node.x + 25, node.y - 25, 20, 20);
        this.ctx.fillStyle = "black";
        this.ctx.fillText(balance, node.x + 35, node.y - 15);
    }

    drawConnections(node) {
        if (node.left) {
            this.ctx.beginPath();
            this.ctx.moveTo(node.x, node.y);
            this.ctx.lineTo(node.left.x, node.left.y);
            this.ctx.stroke();
            this.ctx.closePath();
            this.drawConnections(node.left);
        }
        if (node.right) {
            this.ctx.beginPath();
            this.ctx.moveTo(node.x, node.y);
            this.ctx.lineTo(node.right.x, node.right.y);
            this.ctx.stroke();
            this.ctx.closePath();
            this.drawConnections(node.right);
        }
    }

    drawFullTree() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (this.root) {
            this.drawTree(this.root, this.canvas.width / 2, 30, this.canvas.width / 4);
            this.drawConnections(this.root);
            this.drawAllNodes(this.root);
        }
    }

    drawAllNodes(node) {
        if (node) {
            this.drawNode(node);
            this.drawAllNodes(node.left);
            this.drawAllNodes(node.right);
        }
    }
}