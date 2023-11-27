const codes = [
    // Открытие с 27.11.2023 до 01.02.2024
    { code: 'a49cc6e391e4a14c84ed03a934ad28d8e9529b2a8032088aeaf7505e49ae78ef', open: '2023-11-27', close: '2024-02-01' },
    // Открытие с 01.02.2024 до 01.04.2024
    { code: 'd73be0c84abb29937d7810abd5b9d5c92c69b7b957884c09aad829607e277468', open: '2024-02-01', close: '2024-04-01' },
];

const codeUser = localStorage.getItem("code");
if (!codeUser) { window.location.href = "./security.html"; }

const isOpenCode = (open) => {
    const openCode = open.split('-').join('');
    const nowDate = new Date().toISOString().slice(0, 10).split('-').join('');
    return openCode <= nowDate;
};

const isCloseCode = () => {
    const closeCode = localStorage.getItem('codeClose').split('-').join('');
    const nowDate = new Date().toISOString().slice(0, 10).split('-').join('');
    return closeCode >= nowDate;
};

const originalPassword = codes
    .filter(({ code }) => code === codeUser)
    .filter(({ open }) => isOpenCode(open))
    .filter(() => isCloseCode());


if (originalPassword.length === 0) { window.location.href = "./security.html"; }








