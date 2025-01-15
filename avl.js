class Node {
    constructor(value) {
        this.value = value;
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
        return word1.localeCompare(word2);
    }

    insert(node, value) {
        if (!node) return new Node(value);
        const comparison = this.compareWords(value, node.value);
        if (comparison < 0) {
            node.left = this.insert(node.left, value);
        } else if (comparison > 0) {
            node.right = this.insert(node.right, value);
        } else {
            return node;
        }

        node.height =
            1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
        const balance = this.getBalanceFactor(node);

        if (balance > 1 && this.compareWords(value, node.left.value) < 0) return this.rightRotate(node);
        if (balance < -1 && this.compareWords(value, node.right.value) > 0) return this.leftRotate(node);
        if (balance > 1 && this.compareWords(value, node.left.value) > 0) {
            node.left = this.leftRotate(node.left);
            return this.rightRotate(node);
        }
        if (balance < -1 && this.compareWords(value, node.right.value) < 0) {
            node.right = this.rightRotate(node.right);
            return this.leftRotate(node);
        }
        return node;
    }

    delete(node, value) {
        if (!node) return node;

        const comparison = this.compareWords(value, node.value);
        if (comparison < 0) {
            node.left = this.delete(node.left, value);
        } else if (comparison > 0) {
            node.right = this.delete(node.right, value);
        } else {
            if (!node.left || !node.right) {
                node = node.left ? node.left : node.right;
            } else {
                const minValueNode = this.getMinValueNode(node.right);
                node.value = minValueNode.value;
                node.right = this.delete(node.right, minValueNode.value);
            }
        }

        if (!node) return node;

        node.height =
            1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
        const balance = this.getBalanceFactor(node);

        if (balance > 1 && this.getBalanceFactor(node.left) >= 0)
            return this.rightRotate(node);
        if (balance > 1 && this.getBalanceFactor(node.left) < 0) {
            node.left = this.leftRotate(node.left);
            return this.rightRotate(node);
        }
        if (balance < -1 && this.getBalanceFactor(node.right) <= 0)
            return this.leftRotate(node);
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

    drawTree(node, x, y, dx) {
        if (node) {
            node.x = x;
            node.y = y;
            this.drawTree(node.left, x - dx, y + 100, dx / 2);
            this.drawTree(node.right, x + dx, y + 100, dx / 2);
        }
    }

    drawNode(node) {
        if (!node) return;
        const rectWidth = 55;
        const rectHeight = 35;
        this.ctx.fillStyle = "#00A";
        this.ctx.fillRect(node.x - rectWidth / 2, node.y - rectHeight / 2, rectWidth, rectHeight);
        this.ctx.strokeRect(node.x - rectWidth / 2, node.y - rectHeight / 2, rectWidth, rectHeight);
        this.ctx.fillStyle = "white";
        this.ctx.font = "16px Arial";
        this.ctx.textAlign = "center";
        this.ctx.fillText(node.value, node.x, node.y);

        // Draw balance factor square
        const balanceFactor = this.getBalanceFactor(node);
        this.ctx.fillStyle = "#fff";
        this.ctx.fillRect(node.x + 20, node.y - 25, 25, 25);
        this.ctx.strokeRect(node.x + 20, node.y - 25, 25, 25);
        this.ctx.fillStyle = "#000";
        this.ctx.fillText(balanceFactor, node.x + 33, node.y - 8);
    }

    drawConnections(node) {
        if (node.left) {
            this.ctx.beginPath();
            this.ctx.moveTo(node.x, node.y);
            this.ctx.lineTo(node.left.x, node.left.y);
            this.ctx.stroke();
            this.drawConnections(node.left);
        }
        if (node.right) {
            this.ctx.beginPath();
            this.ctx.moveTo(node.x, node.y);
            this.ctx.lineTo(node.right.x, node.right.y);
            this.ctx.stroke();
            this.drawConnections(node.right);
        }
    }

    drawFullTree() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (this.root) {
            this.drawTree(this.root, this.canvas.width / 2, 50, this.canvas.width / 4);
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