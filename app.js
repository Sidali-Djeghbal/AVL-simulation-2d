(function () {
    const avl = new AVLTree();
    const wordInput = document.getElementById("nodeValue");

    document.getElementById("add").onclick = addValue;
    document.getElementById("search").onclick = searchValue;
    document.getElementById("delete").onclick = deleteValue;

    // Function to display the initial message
    function displayInitialMessage() {
        avl.ctx.font = "20px Arial";
        avl.ctx.fillStyle = "black";
        avl.ctx.textAlign = "center";
        avl.ctx.textBaseline = "middle";

        // Multi-line explanation
        const messages = [
            "Welcome to AVL Tree Simulation! 🌳",
            "This AVL tree works with both numbers and words.",
            "For words, it compares them alphabetically based on their first letter.",
            "If two words start with the same letter, it continues comparing the next letters.",
            "The tree automatically balances itself to maintain optimal performance.",
            "Enter a word or number and click 'Insert' to start."
        ];

        let yOffset = avl.canvas.height / 2 - 100; // Starting Y position
        messages.forEach((msg, index) => {
            avl.ctx.fillText(msg, avl.canvas.width / 2, yOffset + index * 30);
        });
    }

    // Display the initial message when the program starts
    displayInitialMessage();

    function animateNodePosition(node, targetX, targetY, duration = 500) {
        const startX = node.x;
        const startY = node.y;
        const startTime = performance.now();

        function animate(time) {
            const elapsedTime = time - startTime;
            const progress = Math.min(elapsedTime / duration, 1);

            node.x = startX + (targetX - startX) * progress;
            node.y = startY + (targetY - startY) * progress;

            avl.ctx.clearRect(0, 0, avl.canvas.width, avl.canvas.height);
            avl.drawConnections(avl.root);
            avl.drawAllNodes(avl.root);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }

        requestAnimationFrame(animate);
    }

    AVLTree.prototype.updateTreePositions = function (node, x, y, dx) {
        if (node) {
            animateNodePosition(node, x, y);
            this.updateTreePositions(node.left, x - dx, y + 100, dx / 2);
            this.updateTreePositions(node.right, x + dx, y + 100, dx / 2);
        }
    };

    AVLTree.prototype.drawFullTree = function () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (this.root) {
            this.updateTreePositions(
                this.root,
                this.canvas.width / 2,
                50,
                this.canvas.width / 4
            );
        }
    };

    function addValue() {
        const value = wordInput.value.trim();
        if (!value) return;

        // Remove the initial message when the first node is inserted
        if (!avl.root) {
            avl.ctx.clearRect(0, 0, avl.canvas.width, avl.canvas.height);
        }

        avl.root = avl.insert(avl.root, value);
        avl.drawFullTree();

        // Clear the input field after insertion
        wordInput.value = "";
    }

    function searchValue() {
        const value = wordInput.value.trim();
        if (!value) return;

        const path = [];
        const result = searchWithPath(avl.root, value, path);

        if (result) {
            drawPath(path, "yellow");
            highlightNode(result, "yellow");
            setTimeout(() => avl.drawFullTree(), 3000);
        }

        // Clear the input field after search
        wordInput.value = "";
    }

    function deleteValue() {
        const value = wordInput.value.trim();
        if (!value) return;

        const path = [];
        const targetNode = searchWithPath(avl.root, value, path);
        if (targetNode) {
            drawPath(path, "red");
            highlightNode(targetNode, "red");
            setTimeout(() => {
                avl.root = avl.delete(avl.root, value);
                avl.drawFullTree();
            }, 2000);
        }

        // Clear the input field after deletion
        wordInput.value = "";
    }

    function searchWithPath(node, value, path = []) {
        if (!node) return null;
        path.push(node);
        const comparison = avl.compareWords(value, node.value);
        if (comparison === 0) return node;
        return comparison < 0
            ? searchWithPath(node.left, value, path)
            : searchWithPath(node.right, value, path);
    }

    function drawPath(path, color) {
        avl.ctx.strokeStyle = color;
        avl.ctx.lineWidth = 3;
        for (let i = 0; i < path.length - 1; i++) {
            const from = path[i];
            const to = path[i + 1];
            avl.ctx.beginPath();
            avl.ctx.moveTo(from.x, from.y + 20);
            avl.ctx.lineTo(to.x, to.y - 20);
            avl.ctx.stroke();
            avl.ctx.closePath();
        }
        avl.ctx.lineWidth = 1;
        avl.ctx.strokeStyle = "black";
    }

    function highlightNode(node, color) {
        const rectWidth = 60;
        const rectHeight = 40;

        avl.ctx.fillStyle = color;
        avl.ctx.fillRect(node.x - rectWidth / 2, node.y - rectHeight / 2, rectWidth, rectHeight);
        avl.ctx.strokeRect(node.x - rectWidth / 2, node.y - rectHeight / 2, rectWidth, rectHeight);

        avl.ctx.fillStyle = "black";
        avl.ctx.font = "16px Arial";
        avl.ctx.textAlign = "center";
        avl.ctx.textBaseline = "middle";
        avl.ctx.fillText(node.value, node.x, node.y);

        // Draw balance factor square
        const balanceFactor = avl.getBalanceFactor(node);
        avl.ctx.fillStyle = "#fff";
        avl.ctx.fillRect(node.x + 40, node.y - 20, 20, 20);
        avl.ctx.strokeRect(node.x + 40, node.y - 20, 20, 20);
        avl.ctx.fillStyle = "#000";
        avl.ctx.fillText(balanceFactor, node.x + 45, node.y - 10);
    }
})();