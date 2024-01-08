const codes = [
    // Открытие с 27.11.2023 до 01.02.2024
    { code: 'a49cc6e391e4a14c84ed03a934ad28d8e9529b2a8032088aeaf7505e49ae78ef', open: '2023-11-27', close: '2024-02-01' },
    // Открытие с 01.02.2024 до 01.04.2024
    { code: 'd73be0c84abb29937d7810abd5b9d5c92c69b7b957884c09aad829607e277468', open: '2024-02-01', close: '2024-04-01' },
];

document.addEventListener("keydown", (e) => {
    const modal = document.querySelector(".open-modal");
    if (e.code === "Escape" && modal) {
        if (modal.classList.contains("modal-font")) {
            activeModalFonts();
        } else {
            removeTextModal();
        }
    }

    if ((e.ctrlKey && e.code === "KeyC") || (e.ctrlKey && e.code === "Insert")) {
        alert("Ой! Зачем вы хотите скопировать материалы сайта?");
        e.preventDefault();
    }

    if ((e.ctrlKey && e.shiftKey && e.code === "KeyI") || (e.ctrlKey && e.code === "KeyU")) {
        alert("Ой! Зачем вы хотите посмотреть код сайта?");
        e.preventDefault();
    }

    if (e.code === "Enter") {
        checkPassword();
    }
});

document.body.oncopy = function () {
    return false;
};

document.body.ondragstart = function () {
    return false;
};

async function encryptPassword(password, salt) {
    const textEncoder = new TextEncoder();
    const data = textEncoder.encode(password + salt);

    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");

    return hashHex;
}

async function generateSalt() {
    const saltBuffer = crypto.getRandomValues(new Uint8Array(16));
    return Array.from(saltBuffer, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function checkPassword(urlCode = null) {
    const input = document.getElementById("code");
    const enteredPassword = urlCode ?? input.value.replaceAll(" ", "");

    if (enteredPassword === "") {
        return;
    }

    const salt = "4689748nfngngydn";
    const hashedEnteredPassword = await encryptPassword(enteredPassword, salt);

    const isOpenCode = (open) => {
        const openCode = open.split('-').join('');
        const nowDate = new Date().toISOString().slice(0, 10).split('-').join('');
        return openCode <= nowDate;
    };

    const isCloseCode = (close) => {
        const closeCode = close.split('-').join('');
        const nowDate = new Date().toISOString().slice(0, 10).split('-').join('');
        return closeCode >= nowDate;
    };

    const originalPassword = codes
        .filter(({ code }) => code === hashedEnteredPassword)
        .filter(({ open }) => isOpenCode(open))
        .filter(({ close }) => isCloseCode(close));

    if (originalPassword.length !== 0) {
        let codeClose = new Date();
        codeClose.setMonth(codeClose.getMonth() + 2);
        const code = originalPassword[0].code;

        localStorage.setItem("code", code);
        localStorage.setItem("codeClose", codeClose.toISOString().slice(0, 10));
        localStorage.removeItem("errorCode");
        window.location.href = "/";
    } else {
        input.value = "";
        const error = localStorage.getItem("errorCode");
        localStorage.setItem("errorCode", (Number(error) ?? 0) + 1);
        formAddClassError();
        ban();
    }
}

const formAddClassError = () => {
    const main = document.querySelector(".security");
    if (Number(localStorage.getItem("errorCode")) > 0) {
        main.classList.add("error-code");
    }

    ban();
};

const buildPage = () => {
    const main = document.createElement('main');

    const box = document.createElement('div');
    box.classList.add('security');

    const title = document.createElement('h1');
    title.classList.add('security__title');
    title.textContent = 'Welcome!';

    const row = document.createElement('div');
    row.classList.add('security__row');

    const div = document.createElement('div');
    div.classList.add('security__input');

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'xxxx xxxx xxxx';
    input.id = 'code';
    input.maxLength = '14';
    input.autocomplete = 'off';

    const label = document.createElement('label');
    label.textContent = "Упс, код неверен :("

    const btn = document.createElement('button');
    btn.classList.add('btn-security');

    div.append(input, label);
    row.append(div, btn);
    box.append(title, row);
    main.append(box);
    document.body.append(main);
};

buildPage();

const ban = () => {
    if (Number(localStorage.getItem("errorCode")) >= 5) {
        document.querySelector(".security").remove();

        const main = document.querySelector('main');

        const div = document.createElement("div");
        div.classList.add("stop");
        div.textContent = "Упс, доступ закрыт :(";

        main.append(div);
        document.body.append(main);
    }
};

ban();

const verificationCode = () => {
    const btn = document.querySelector(".btn-security");
    if (btn === null) { return; }
    btn.addEventListener("click", () => checkPassword());
};

verificationCode();

async function verificationUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) { await checkPassword(code); }
};

verificationUrl();

