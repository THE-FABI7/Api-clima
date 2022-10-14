/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./resources/**/*.{html, js}"],
  theme: {
    extend: {
     // https://coolors.co/palette/03045e-023e8a-0077b6-0096c7-00b4d8-48cae4-90e0ef-ade8f4-caf0f8
      colors: {
        primary: "rgba(0, 0, 0, 0.4)",
        firts: "#03045E",
        second: "#023E8A",
        three: "#caf0f8",
        letras: "#03071e",
        fondolabel: "#caf0f8",
        fondoinfo: "#f6fff8",
       
      },
    },
  },
  plugins: [],
};
