(function () {
    const avl = new AVLTree();
    const numberInput = document.getElementById("nodeValue");

    document.getElementById("add").onclick = addValue;
    document.getElementById("search").onclick = searchValue;
    document.getElementById("delete").onclick = deleteValue;
    document.getElementById("array").onclick = popup;

    function addValue() {
        const word = numberInput.value.trim();
        if (!word) return;

        avl.root = avl.insert(avl.root, word);
        avl.drawFullTree();
    }

    function searchValue() {
        const word = numberInput.value.trim();
        if (!word) return;

        const node = avl.search(avl.root, word);
        if (node) {
            highlightNodeYellow(node);
            setTimeout(() => avl.drawFullTree(), 2000);
        }
    }

    function deleteValue() {
        const word = numberInput.value.trim();
        if (!word) return;

        avl.root = avl.delete(avl.root, word);
        avl.drawFullTree();
    }

    function highlightNodeYellow(node) {
        avl.ctx.fillStyle = "yellow";
        avl.ctx.fillRect(node.x - 35, node.y - 25, 70, 50);
        avl.drawNode(node);
    }

    function popup() {
        const popupContainer = document.querySelector(".popup-container");
        const closeBtn = document.querySelector(".close-btn");
        const popupMessage = document.getElementById("popup-message");

        const arr = [];
        avl.inOrder((node) => arr.push(node.word));

        popupMessage.textContent = "Ordered list: [" + arr.join(", ") + "]";
        popupContainer.classList.add("active");

        closeBtn.onclick = () => {
            popupContainer.classList.remove("active");
        };
    }
})();