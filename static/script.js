document.addEventListener("DOMContentLoaded", function () {

    const wishForm = document.getElementById("wishForm");
    const wishButton = document.getElementById("wishButton");
    const wishFormContainer =
        document.getElementById("wishFormContainer");
    const closeForm = document.getElementById("closeForm");

    const nameInput = document.getElementById("nameInput");
    const wishInput = document.getElementById("wishInput");
    const submitWish = document.getElementById("submitWish");
    const wishContainer =
        document.getElementById("wishContainer");


    /* =====================================
       OPEN FORM
    ===================================== */

    wishButton.addEventListener("click", function () {

        wishFormContainer.classList.add("open");

        wishFormContainer.setAttribute(
            "aria-hidden",
            "false"
        );

        nameInput.focus();
    });


    /* =====================================
       CLOSE FORM
    ===================================== */

    function closeWishForm() {

        wishFormContainer.classList.remove("open");

        wishFormContainer.setAttribute(
            "aria-hidden",
            "true"
        );
    }

    closeForm.addEventListener(
        "click",
        closeWishForm
    );


    /* Close when clicking the dark background */

    wishFormContainer.addEventListener(
        "click",
        function (event) {

            if (event.target === wishFormContainer) {
                closeWishForm();
            }

        }
    );


    /* =====================================
       SUBMIT WISH
    ===================================== */

    wishForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const name = nameInput.value.trim();
            const wish = wishInput.value.trim();

            if (name === "" || wish === "") {

                showNotification(
                    "Please enter your name and birthday wish 💕",
                    "💌"
                );

                return;
            }


            /* Prevent double clicks */

            submitWish.disabled = true;

            submitWish.textContent =
                "Sending your birthday love... 💕";


            try {

                const response = await fetch(
                    "/wishes",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            name: name,
                            wish: wish
                        })
                    }
                );


                if (!response.ok) {
                    throw new Error(
                        "Failed to send birthday wish"
                    );
                }


                const data =
                    await response.json();


                /* SUCCESS NOTIFICATION */

                showNotification(
                    data.message ||
                    `Thank you, ${name}! Your birthday love is on the wall 💕`,
                    "💌"
                );


                /* PETAL CELEBRATION */

                for (let i = 0; i < 35; i++) {

                    setTimeout(
                        function () {
                            createPetal();
                        },
                        i * 50
                    );

                }


                /* CLOSE + RESET */

                closeWishForm();

                wishForm.reset();


                /* REFRESH WALL */

                await loadWishes();

            }


            catch (error) {

                console.error(
                    "Birthday wish error:",
                    error
                );

                showNotification(
                    "Something went wrong. Please try again.",
                    "😢"
                );

            }


            finally {

                submitWish.disabled = false;

                submitWish.textContent =
                    "💕 Send Birthday Love";

            }

        }
    );


    /* =====================================
       LOAD WISHES
    ===================================== */

    async function loadWishes() {

        try {

            const response =
                await fetch("/wishes");

            if (!response.ok) {
                throw new Error(
                    "Could not load wishes"
                );
            }

            const wishes =
                await response.json();


            wishContainer.innerHTML = "";


            if (wishes.length === 0) {

                const emptyMessage =
                    document.createElement("p");

                emptyMessage.textContent =
                    "Your birthday love will appear here. 💕";

                emptyMessage.style.textAlign =
                    "center";

                wishContainer.appendChild(
                    emptyMessage
                );

                return;
            }


            wishes.forEach(function (wish) {

                const wishCard =
                    document.createElement("div");

                wishCard.classList.add(
                    "wish-card"
                );


                /* Header */

                const header =
                    document.createElement("div");

                header.classList.add(
                    "wish-card-header"
                );


                const envelope =
                    document.createElement("span");

                envelope.classList.add(
                    "wish-envelope"
                );

                envelope.textContent = "💌";


                const name =
                    document.createElement("h3");

                name.textContent =
                    wish.name;


                header.appendChild(envelope);
                header.appendChild(name);


                /* Message */

                const message =
                    document.createElement("p");

                message.classList.add(
                    "wish-message"
                );

                message.textContent =
                    `"${wish.message}"`;


                /* Footer */

                const footer =
                    document.createElement("div");

                footer.classList.add(
                    "wish-footer"
                );

                footer.textContent =
                    "❤️ Birthday Love";


                wishCard.appendChild(header);
                wishCard.appendChild(message);
                wishCard.appendChild(footer);

                wishContainer.appendChild(
                    wishCard
                );

            });

        }


        catch (error) {

            console.error(
                "Could not load wishes:",
                error
            );

        }

    }


    /* =====================================
       PETAL ANIMATION
    ===================================== */

    function createPetal() {

        const petals = [
            "🌸",
            "💕",
            "💖",
            "✨",
            "🌷",
            "💗"
        ];


        const petal =
            document.createElement("div");


        petal.classList.add("petal");


        petal.textContent =
            petals[
                Math.floor(
                    Math.random() *
                    petals.length
                )
            ];


        petal.style.left =
            Math.random() * 100 + "vw";


        petal.style.animationDuration =
            (Math.random() * 3 + 3) + "s";


        petal.style.fontSize =
            (Math.random() * 15 + 20) + "px";


        document.body.appendChild(
            petal
        );


        setTimeout(
            function () {
                petal.remove();
            },
            6500
        );

    }


    /* =====================================
       NOTIFICATION
    ===================================== */

    function showNotification(
        message,
        emoji = "💌"
    ) {

        const notification =
            document.createElement("div");


        notification.classList.add(
            "birthday-notification"
        );


        const icon =
            document.createElement("span");

        icon.classList.add(
            "notification-icon"
        );

        icon.textContent = emoji;


        const content =
            document.createElement("div");


        const title =
            document.createElement("strong");

        title.textContent =
            "Birthday love received!";


        const text =
            document.createElement("p");

        text.textContent =
            message;


        content.appendChild(title);
        content.appendChild(text);


        notification.appendChild(icon);
        notification.appendChild(content);


        document.body.appendChild(
            notification
        );


        setTimeout(
            function () {
                notification.classList.add(
                    "show"
                );
            },
            10
        );


        setTimeout(
            function () {

                notification.classList.remove(
                    "show"
                );

                setTimeout(
                    function () {
                        notification.remove();
                    },
                    500
                );

            },
            4000
        );

    }


    /* =====================================
       REACTIONS
    ===================================== */

    const hugButton =
        document.getElementById("hugButton");

    const loveButton =
        document.getElementById("loveButton");

    const partyButton =
        document.getElementById("partyButton");


    function showReaction(
        message,
        emoji
    ) {

        showNotification(
            message,
            emoji
        );


        for (let i = 0; i < 10; i++) {

            setTimeout(
                function () {
                    createPetal();
                },
                i * 80
            );

        }

    }


    hugButton.addEventListener(
        "click",
        function () {

            showReaction(
                "Abisola received a virtual hug!",
                "🤗"
            );

        }
    );


    loveButton.addEventListener(
        "click",
        function () {

            showReaction(
                "Abisola received some birthday love!",
                "❤️"
            );

        }
    );


    partyButton.addEventListener(
        "click",
        function () {

            showReaction(
                "Let's celebrate Abisola!",
                "🎉"
            );

        }
    );


    /* =====================================
       INITIAL LOAD
    ===================================== */

    loadWishes();

});
