(function () {
    const avl = new AVLTree();
    const numberInput = document.getElementById("nodeValue");

    document.getElementById("add").onclick = async () => {
        const word = numberInput.value.trim();
        if (!word) return;

        await avl.insertDynamic(word); // Dynamic insertion process
    };

    document.getElementById("search").onclick = () => {
        const word = numberInput.value.trim();
        if (!word) return;

        const node = avl.search(avl.root, word);
        if (node) {
            avl.highlightNode(node, "yellow");
        }
    };

    document.getElementById("delete").onclick = async () => {
        const word = numberInput.value.trim();
        if (!word) return;

        await avl.deleteDynamic(word); // Dynamic deletion process
    };

    document.getElementById("array").onclick = () => {
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
    };
})();