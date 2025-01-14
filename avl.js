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
        console.log("Canvas initialized:", this.canvas, this.ctx);
    }

    delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async insertDynamic(word) {
        console.log("Starting dynamic insertion for:", word);
        this.root = await this.insert(this.root, word, true);
        console.log("Dynamic insertion complete.");
    }

    async insert(node, word, dynamic = false) {
        if (!node) {
            const newNode = new Node(word);
            if (dynamic) {
                console.log("Creating new node:", newNode);
                this.drawFullTree();
                await this.delay(500);
            }
            return newNode;
        }

        const comparison = this.compareWords(word, node.word);
        if (comparison < 0) {
            node.left = await this.insert(node.left, word, dynamic);
        } else if (comparison > 0) {
            node.right = await this.insert(node.right, word, dynamic);
        } else {
            return node;
        }

        node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
        const balance = this.getBalanceFactor(node);

        if (dynamic) {
            console.log("Updating node:", node, "Balance factor:", balance);
            this.updateTreePositions(this.root, this.canvas.width / 2, 30, this.canvas.width / 4); // Smooth update
            await this.delay(500);
        }

        if (balance > 1 && this.compareWords(word, node.left.word) < 0) {
            return this.rightRotate(node);
        }
        if (balance < -1 && this.compareWords(word, node.right.word) > 0) {
            return this.leftRotate(node);
        }
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

    highlightNode(node, color) {
        console.log("Highlighting node:", node, "Color:", color);
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, 25, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.stroke();
    }

    async updateTreePositions(node, x, y, dx) {
        if (node) {
            const targetX = x;
            const targetY = y;
            await this.animateNodePosition(node, targetX, targetY);

            await this.updateTreePositions(node.left, x - dx, y + 60, dx / 2);
            await this.updateTreePositions(node.right, x + dx, y + 60, dx / 2);
        }
    }

    async animateNodePosition(node, targetX, targetY, duration = 500) {
        const startX = node.x;
        const startY = node.y;
        const startTime = performance.now();

        const animate = (time) => {
            const elapsedTime = time - startTime;
            const progress = Math.min(elapsedTime / duration, 1);

            node.x = startX + (targetX - startX) * progress;
            node.y = startY + (targetY - startY) * progress;

            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.drawConnections(this.root);
            this.drawAllNodes(this.root);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        return new Promise((resolve) => {
            const frame = (time) => {
                animate(time);
                if (node.x === targetX && node.y === targetY) {
                    resolve();
                } else {
                    requestAnimationFrame(frame);
                }
            };
            requestAnimationFrame(frame);
        });
    }

    drawFullTree() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (this.root) {
            this.updateTreePositions(this.root, this.canvas.width / 2, 30, this.canvas.width / 4);
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

