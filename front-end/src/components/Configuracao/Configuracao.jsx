import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Daltonismo from "../Daltonismo/Daltonismo";
import "./Configuracao.css";

const Configuracao = () => {
    const [currentTheme, setCurrentTheme] = useState(() => {
        return localStorage.getItem("selectedTheme") || "ForestNight";
    });

    const colorButtons = [
        {
            backgroundColor: "#12222a",
            colors: ["#349854", "#f9f9f9"],
            themeName: "ForestNight",
        },
        {
            backgroundColor: "#2b2b2b",
            colors: ["#5DBA6A", "#e4e2dd"],
            themeName: "DarkMeadow",
        },
        {
            backgroundColor: "#1c2431",
            colors: ["#3478f6", "#f2f5fc"],
            themeName: "MidnightBlue",
        },
        {
            backgroundColor: "#3d3025",
            colors: ["#e07b39", "#faf3ee"],
            themeName: "AutumnSpice",
        },
        {
            backgroundColor: "#2a1f2f",
            colors: ["#db3b74", "#f9eef5"],
            themeName: "Rosewood",
        },
        {
            backgroundColor: "#1b1e20",
            colors: ["#71797e", "#e8ebed"],
            themeName: "CharcoalMist",
        },
        {
            backgroundColor: "#3b2a1d",
            colors: ["#ff9800", "#fff7e0"],
            themeName: "GoldenSunset",
        },
        {
            backgroundColor: "#201926",
            colors: ["#9c27b0", "#f3edf8"],
            themeName: "AmethystDream",
        },
        {
            backgroundColor: "#2e1d1c",
            colors: ["#e53935", "#fbeaea"],
            themeName: "CrimsonBloom",
        },
        {
            backgroundColor: "#1c2b2d",
            colors: ["#00bcd4", "#e0f7f9"],
            themeName: "OceanBreeze",
        },
        {
            backgroundColor: "#4d2d52",
            colors: ["#f67280", "#fbeff6"],
            themeName: "PinkGalaxy",
        },
        {
            backgroundColor: "#3f5c5b",
            colors: ["#50b2c0", "#edf7f5"],
            themeName: "AquaCalm",
        },
        {
            backgroundColor: "#414141",
            colors: ["#f5a623", "#fcf8e3"],
            themeName: "GoldenGlow",
        },
    ];

    const themeColors = {
        ForestNight: {
            "--primary-color": "#f9f9f9",
            "--fifth-color": "#F2F2F2",
            "--sixth-color": "#EBEBEB",
            "--seventh-color": "#DDDDDD",
            "--third-color": "#349854",
            "--fourth-color": "#12222a",
            "--card-color1": "#12222a",
            "--card-color2": "#f9f9f9"
        },
        DarkMeadow: {
            "--primary-color": "#E4E2DD",
            "--fifth-color": "#F6F4F2",
            "--sixth-color": "#EFEFE9",
            "--seventh-color": "#EAE5DC",
            "--third-color": "#5DBA6A",
            "--fourth-color": "#2b2b2b",
            "--card-color1": "#2b2b2b",
            "--card-color2": "#E4E2DD"
        },
        MidnightBlue: {
            "--primary-color": "#f2f5fc",
            "--fifth-color": "#E8EDF9",
            "--sixth-color": "#DDE8F6",
            "--seventh-color": "#CAD8F0",
            "--third-color": "#3478f6",
            "--fourth-color": "#1c2431",
            "--card-color1": "#1c2431",
            "--card-color2": "#f2f5fc"
        },
        AutumnSpice: {
            "--primary-color": "#faf3ee",
            "--fifth-color": "#F5EADC",
            "--sixth-color": "#EAD4BC",
            "--seventh-color": "#DFC0A2",
            "--third-color": "#e07b39",
            "--fourth-color": "#3d3025",
            "--card-color1": "#3d3025",
            "--card-color2": "#faf3ee"
        },
        Rosewood: {
            "--primary-color": "#f9eef5",
            "--fifth-color": "#F5E3EF",
            "--sixth-color": "#EDD3E5",
            "--seventh-color": "#E2C1DA",
            "--third-color": "#db3b74",
            "--fourth-color": "#2a1f2f",
            "--card-color1": "#2a1f2f",
            "--card-color2": "#f9eef5"
        },
        CharcoalMist: {
            "--primary-color": "#e8ebed",
            "--fifth-color": "#E2E6E8",
            "--sixth-color": "#D4D9DB",
            "--seventh-color": "#C5CACC",
            "--third-color": "#71797e",
            "--fourth-color": "#1b1e20",
            "--card-color1": "#1b1e20",
            "--card-color2": "#e8ebed"
        },
        GoldenSunset: {
            "--primary-color": "#fff7e0",
            "--fifth-color": "#FFF1CC",
            "--sixth-color": "#FEE5A9",
            "--seventh-color": "#FED890",
            "--third-color": "#ff9800",
            "--fourth-color": "#3b2a1d",
            "--card-color1": "#3b2a1d",
            "--card-color2": "#fff7e0"
        },
        AmethystDream: {
            "--primary-color": "#f3edf8",
            "--fifth-color": "#ECE3F3",
            "--sixth-color": "#DED0EC",
            "--seventh-color": "#D2C0E6",
            "--third-color": "#9c27b0",
            "--fourth-color": "#201926",
            "--card-color1": "#201926",
            "--card-color2": "#f3edf8"
        },
        CrimsonBloom: {
            "--primary-color": "#fbeaea",
            "--fifth-color": "#F8DEDE",
            "--sixth-color": "#F3C8C8",
            "--seventh-color": "#ECB1B1",
            "--third-color": "#e53935",
            "--fourth-color": "#2e1d1c",
            "--card-color1": "#2e1d1c",
            "--card-color2": "#fbeaea"
        },
        OceanBreeze: {
            "--primary-color": "#e0f7f9",
            "--fifth-color": "#D2F0F4",
            "--sixth-color": "#BDE6ED",
            "--seventh-color": "#A8DDE5",
            "--third-color": "#00bcd4",
            "--fourth-color": "#1c2b2d",
            "--card-color1": "#1c2b2d",
            "--card-color2": "#e0f7f9"
        },
        PinkGalaxy: {
            "--primary-color": "#fbeff6",
            "--fifth-color": "#F7E2F1",
            "--sixth-color": "#EEC5E5",
            "--seventh-color": "#E3A9D9",
            "--third-color": "#f67280",
            "--fourth-color": "#4d2d52",
            "--card-color1": "#4d2d52",
            "--card-color2": "#fbeff6"
        },
        AquaCalm: {
            "--primary-color": "#edf7f5",
            "--fifth-color": "#E7F1EE",
            "--sixth-color": "#DCEAE7",
            "--seventh-color": "#D3E1DC",
            "--third-color": "#50b2c0",
            "--fourth-color": "#3f5c5b",
            "--card-color1": "#3f5c5b",
            "--card-color2": "#edf7f5"
        },
        GoldenGlow: {
            "--primary-color": "#fcf8e3",
            "--fifth-color": "#F9F4D6",
            "--sixth-color": "#F2EAC8",
            "--seventh-color": "#EDE0B5",
            "--third-color": "#f5a623",
            "--fourth-color": "#414141",
            "--card-color1": "#414141",
            "--card-color2": "#fcf8e3"
        }
    };

    const setThemeColors = (theme) => {
        const root = document.documentElement;
        const colors = themeColors[theme];
        setCurrentTheme(theme);
        localStorage.setItem("selectedTheme", theme);

        if (colors) {
            Object.entries(colors).forEach(([key, value]) => {
                root.style.setProperty(key, value);
            });
        }
    };

    useEffect(() => {
        const savedTheme = localStorage.getItem("selectedTheme") || "ForestNight";
        setThemeColors(savedTheme);
    }, []);

    const telefone = import.meta.env.VITE_PERSONAL_PHONE;

    return (
        <div className="content-config">
            <div className="container-config">
                <p>Cores</p>
                <div className="select-colors">
                    {colorButtons.map((button, index) => (
                        <Button
                            key={index}
                            variant="contained"
                            sx={{
                                padding: 0.5,
                                minWidth: "auto",
                                width: "35px",
                                height: "25px",
                                backgroundColor: button.backgroundColor,
                            }}
                            onClick={() => setThemeColors(button.themeName)}
                        >
                            <div className="grid-container">
                                {/* {index === colorButtons.length - 1 ? <span style={{ padding: "0 5.3px" }}>DIY</span> : ""} */}
                                <div
                                    className="cell"
                                    style={{
                                        backgroundColor: button.colors[0],
                                        borderRadius: "4px 0 0 4px",
                                    }}
                                ></div>
                                <div
                                    className="cell"
                                    style={{
                                        backgroundColor: button.colors[1],
                                        borderRadius: "0 4px 4px 0",
                                    }}
                                ></div>
                            </div>
                        </Button>
                    ))}
                </div>
                <p>Daltonismo</p>
                <Daltonismo currentTheme={currentTheme} />
                <p>Contato de emergência</p>
                <div style={{ marginBottom: '1rem', fontFamily: 'Arial', opacity: 0.8 }}>
                    <span style={{ marginLeft: '2px' }}>
                        Telefone: {telefone}
                    </span>
                    <br />
                    <span style={{ marginLeft: '2px' }}>
                        Gmail: gabriellucreg@gmail.com
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Configuracao;

