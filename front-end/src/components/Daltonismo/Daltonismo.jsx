/* eslint-disable react/prop-types */
import { useState } from "react";
import Button from "@mui/material/Button";

const Daltonismo = ({ currentTheme }) => {
    const accessibleThemes = {
        ForestNight: {
            protanopia: {
                "--primary-color": "#d4f5d3",
                "--third-color": "#5ca877",
                "--fifth-color": "#F2F2F2",
                "--sixth-color": "#EBEBEB",
                "--seventh-color": "#DDDDDD",
                "--fourth-color": "#12222a",
                "--card-color1": "#12222a",
                "--card-color2": "#f9f9f9"
            },
            deuteranopia: {
                "--primary-color": "#d3e4d3",
                "--third-color": "#57a863",
                "--fifth-color": "#F2F2F2",
                "--sixth-color": "#EBEBEB",
                "--seventh-color": "#DDDDDD",
                "--fourth-color": "#12222a",
                "--card-color1": "#12222a",
                "--card-color2": "#f9f9f9"
            },
            tritanopia: {
                "--primary-color": "#cce9f5",
                "--third-color": "#46a9b8",
                "--fifth-color": "#F2F2F2",
                "--sixth-color": "#EBEBEB",
                "--seventh-color": "#DDDDDD",
                "--fourth-color": "#12222a",
                "--card-color1": "#12222a",
                "--card-color2": "#f9f9f9"
            }
        },
        DarkMeadow: {
            protanopia: {
                "--primary-color": "#e8e7dc",
                "--third-color": "#6faa78",
                "--fifth-color": "#F6F4F2",
                "--sixth-color": "#EFEFE9",
                "--seventh-color": "#EAE5DC",
                "--fourth-color": "#2b2b2b",
                "--card-color1": "#2b2b2b",
                "--card-color2": "#E4E2DD"
            },
            deuteranopia: {
                "--primary-color": "#d9e5dc",
                "--third-color": "#59b378",
                "--fifth-color": "#F6F4F2",
                "--sixth-color": "#EFEFE9",
                "--seventh-color": "#EAE5DC",
                "--fourth-color": "#2b2b2b",
                "--card-color1": "#2b2b2b",
                "--card-color2": "#E4E2DD"
            },
            tritanopia: {
                "--primary-color": "#cdeaf4",
                "--third-color": "#43aac4",
                "--fifth-color": "#F6F4F2",
                "--sixth-color": "#EFEFE9",
                "--seventh-color": "#EAE5DC",
                "--fourth-color": "#2b2b2b",
                "--card-color1": "#2b2b2b",
                "--card-color2": "#E4E2DD"
            }
        },
        MidnightBlue: {
            protanopia: {
                "--primary-color": "#f4f9fc",
                "--third-color": "#6798f3",
                "--fifth-color": "#E8EDF9",
                "--sixth-color": "#DDE8F6",
                "--seventh-color": "#CAD8F0",
                "--fourth-color": "#1c2431",
                "--card-color1": "#1c2431",
                "--card-color2": "#f2f5fc"
            },
            deuteranopia: {
                "--primary-color": "#f4f8fa",
                "--third-color": "#608de6",
                "--fifth-color": "#E8EDF9",
                "--sixth-color": "#DDE8F6",
                "--seventh-color": "#CAD8F0",
                "--fourth-color": "#1c2431",
                "--card-color1": "#1c2431",
                "--card-color2": "#f2f5fc"
            },
            tritanopia: {
                "--primary-color": "#e6f3f9",
                "--third-color": "#56acc4",
                "--fifth-color": "#E8EDF9",
                "--sixth-color": "#DDE8F6",
                "--seventh-color": "#CAD8F0",
                "--fourth-color": "#1c2431",
                "--card-color1": "#1c2431",
                "--card-color2": "#f2f5fc"
            }
        },
        AutumnSpice: {
            protanopia: {
                "--primary-color": "#fbe8d6",
                "--third-color": "#da8f6a",
                "--fifth-color": "#FAF0DF",
                "--sixth-color": "#F8E6D4",
                "--seventh-color": "#F2DBC5",
                "--fourth-color": "#3d3025",
                "--card-color1": "#3d3025",
                "--card-color2": "#faf3ee"
            },
            deuteranopia: {
                "--primary-color": "#f9e3d0",
                "--third-color": "#d18463",
                "--fifth-color": "#FAF0DF",
                "--sixth-color": "#F8E6D4",
                "--seventh-color": "#F2DBC5",
                "--fourth-color": "#3d3025",
                "--card-color1": "#3d3025",
                "--card-color2": "#faf3ee"
            },
            tritanopia: {
                "--primary-color": "#f4ded9",
                "--third-color": "#c9805d",
                "--fifth-color": "#FAF0DF",
                "--sixth-color": "#F8E6D4",
                "--seventh-color": "#F2DBC5",
                "--fourth-color": "#3d3025",
                "--card-color1": "#3d3025",
                "--card-color2": "#faf3ee"
            }
        },
        Rosewood: {
            protanopia: {
                "--primary-color": "#f9e8f0",
                "--third-color": "#e67392",
                "--fifth-color": "#F5EDF5",
                "--sixth-color": "#F3E6F0",
                "--seventh-color": "#EBDDE8",
                "--fourth-color": "#2a1f2f",
                "--card-color1": "#2a1f2f",
                "--card-color2": "#f9eef5"
            },
            deuteranopia: {
                "--primary-color": "#f9e4ec",
                "--third-color": "#d46a8b",
                "--fifth-color": "#F5EDF5",
                "--sixth-color": "#F3E6F0",
                "--seventh-color": "#EBDDE8",
                "--fourth-color": "#2a1f2f",
                "--card-color1": "#2a1f2f",
                "--card-color2": "#f9eef5"
            },
            tritanopia: {
                "--primary-color": "#f5e8ef",
                "--third-color": "#c96483",
                "--fifth-color": "#F5EDF5",
                "--sixth-color": "#F3E6F0",
                "--seventh-color": "#EBDDE8",
                "--fourth-color": "#2a1f2f",
                "--card-color1": "#2a1f2f",
                "--card-color2": "#f9eef5"
            }
        },
        CharcoalMist: {
            protanopia: {
                "--primary-color": "#e8ebed",
                "--fifth-color": "#E2E6E8",
                "--sixth-color": "#D4D9DB",
                "--seventh-color": "#C5CACC",
                "--third-color": "#87919b",
                "--fourth-color": "#1b1e20",
                "--card-color1": "#1b1e20",
                "--card-color2": "#e8ebed"
            },
            deuteranopia: {
                "--primary-color": "#e7ebec",
                "--third-color": "#828c94",
                "--fifth-color": "#E2E6E8",
                "--sixth-color": "#D4D9DB",
                "--seventh-color": "#C5CACC",
                "--fourth-color": "#1b1e20",
                "--card-color1": "#1b1e20",
                "--card-color2": "#e8ebed"
            },
            tritanopia: {
                "--primary-color": "#e3ebef",
                "--third-color": "#6f91a2",
                "--fifth-color": "#E2E6E8",
                "--sixth-color": "#D4D9DB",
                "--seventh-color": "#C5CACC",
                "--fourth-color": "#1b1e20",
                "--card-color1": "#1b1e20",
                "--card-color2": "#e8ebed"
            }
        },
        GoldenSunset: {
            protanopia: {
                "--primary-color": "#ffe4c1",
                "--third-color": "#f1a257",
                "--fifth-color": "#FFF1CC",
                "--sixth-color": "#FEE5A9",
                "--seventh-color": "#FED890",
                "--fourth-color": "#3b2a1d",
                "--card-color1": "#3b2a1d",
                "--card-color2": "#fff7e0"
            },
            deuteranopia: {
                "--primary-color": "#ffe3be",
                "--third-color": "#eaa04f",
                "--fifth-color": "#FFF1CC",
                "--sixth-color": "#FEE5A9",
                "--seventh-color": "#FED890",
                "--fourth-color": "#3b2a1d",
                "--card-color1": "#3b2a1d",
                "--card-color2": "#fff7e0"
            },
            tritanopia: {
                "--primary-color": "#ffe3c5",
                "--third-color": "#dfa157",
                "--fifth-color": "#FFF1CC",
                "--sixth-color": "#FEE5A9",
                "--seventh-color": "#FED890",
                "--fourth-color": "#3b2a1d",
                "--card-color1": "#3b2a1d",
                "--card-color2": "#fff7e0"
            }
        },
        AmethystDream: {
            protanopia: {
                "--primary-color": "#f4f2f7",
                "--third-color": "#b987d1",
                "--fifth-color": "#ECE3F3",
                "--sixth-color": "#DED0EC",
                "--seventh-color": "#D2C0E6",
                "--fourth-color": "#201926",
                "--card-color1": "#201926",
                "--card-color2": "#f3edf8"
            },
            deuteranopia: {
                "--primary-color": "#f2f0f6",
                "--third-color": "#a985d1",
                "--fifth-color": "#ECE3F3",
                "--sixth-color": "#DED0EC",
                "--seventh-color": "#D2C0E6",
                "--fourth-color": "#201926",
                "--card-color1": "#201926",
                "--card-color2": "#f3edf8"
            },
            tritanopia: {
                "--primary-color": "#eceef4",
                "--third-color": "#9885cc",
                "--fifth-color": "#ECE3F3",
                "--sixth-color": "#DED0EC",
                "--seventh-color": "#D2C0E6",
                "--fourth-color": "#201926",
                "--card-color1": "#201926",
                "--card-color2": "#f3edf8"
            }
        },
        CrimsonBloom: {
            protanopia: {
                "--primary-color": "#fad9d9",
                "--third-color": "#e7706f",
                "--fifth-color": "#F8DEDE",
                "--sixth-color": "#F3C8C8",
                "--seventh-color": "#ECB1B1",
                "--fourth-color": "#2e1d1c",
                "--card-color1": "#2e1d1c",
                "--card-color2": "#fbeaea"
            },
            deuteranopia: {
                "--primary-color": "#f8d3d3",
                "--third-color": "#d66767",
                "--fifth-color": "#F8DEDE",
                "--sixth-color": "#F3C8C8",
                "--seventh-color": "#ECB1B1",
                "--fourth-color": "#2e1d1c",
                "--card-color1": "#2e1d1c",
                "--card-color2": "#fbeaea"
            },
            tritanopia: {
                "--primary-color": "#f9d8d8",
                "--third-color": "#c56161",
                "--fifth-color": "#F8DEDE",
                "--sixth-color": "#F3C8C8",
                "--seventh-color": "#ECB1B1",
                "--fourth-color": "#2e1d1c",
                "--card-color1": "#2e1d1c",
                "--card-color2": "#fbeaea"
            }
        },
        OceanBreeze: {
            protanopia: {
                "--primary-color": "#d8f3f4",
                "--third-color": "#58c6cf",
                "--fifth-color": "#D2F0F4",
                "--sixth-color": "#BDE6ED",
                "--seventh-color": "#A8DDE5",
                "--fourth-color": "#1c2b2d",
                "--card-color1": "#1c2b2d",
                "--card-color2": "#e0f7f9"
            },
            deuteranopia: {
                "--primary-color": "#d6f2f4",
                "--third-color": "#51b9c8",
                "--fifth-color": "#D2F0F4",
                "--sixth-color": "#BDE6ED",
                "--seventh-color": "#A8DDE5",
                "--fourth-color": "#1c2b2d",
                "--card-color1": "#1c2b2d",
                "--card-color2": "#e0f7f9"
            },
            tritanopia: {
                "--primary-color": "#d7f0f2",
                "--third-color": "#4badc2",
                "--fifth-color": "#D2F0F4",
                "--sixth-color": "#BDE6ED",
                "--seventh-color": "#A8DDE5",
                "--fourth-color": "#1c2b2d",
                "--card-color1": "#1c2b2d",
                "--card-color2": "#e0f7f9"
            }
        },
        PinkGalaxy: {
            protanopia: {
                "--primary-color": "#fce2ee",
                "--third-color": "#f692a5",
                "--fifth-color": "#F7E2F1",
                "--sixth-color": "#EEC5E5",
                "--seventh-color": "#E3A9D9",
                "--fourth-color": "#4d2d52",
                "--card-color1": "#4d2d52",
                "--card-color2": "#fbeff6"
            },
            deuteranopia: {
                "--primary-color": "#f9dde9",
                "--third-color": "#ed84a1",
                "--fifth-color": "#F7E2F1",
                "--sixth-color": "#EEC5E5",
                "--seventh-color": "#E3A9D9",
                "--fourth-color": "#4d2d52",
                "--card-color1": "#4d2d52",
                "--card-color2": "#fbeff6"
            },
            tritanopia: {
                "--primary-color": "#f7e3ec",
                "--third-color": "#e97ca3",
                "--fifth-color": "#F7E2F1",
                "--sixth-color": "#EEC5E5",
                "--seventh-color": "#E3A9D9",
                "--fourth-color": "#4d2d52",
                "--card-color1": "#4d2d52",
                "--card-color2": "#fbeff6"
            }
        },
        AquaCalm: {
            protanopia: {
                "--primary-color": "#e7f6f5",
                "--third-color": "#58c3cb",
                "--fifth-color": "#E7F1EE",
                "--sixth-color": "#DCEAE7",
                "--seventh-color": "#D3E1DC",
                "--fourth-color": "#3f5c5b",
                "--card-color1": "#3f5c5b",
                "--card-color2": "#edf7f5"
            },
            deuteranopia: {
                "--primary-color": "#e5f4f3",
                "--third-color": "#4fb9c2",
                "--fifth-color": "#E7F1EE",
                "--sixth-color": "#DCEAE7",
                "--seventh-color": "#D3E1DC",
                "--fourth-color": "#3f5c5b",
                "--card-color1": "#3f5c5b",
                "--card-color2": "#edf7f5"
            },
            tritanopia: {
                "--primary-color": "#e3f3f2",
                "--third-color": "#47acc0",
                "--fifth-color": "#E7F1EE",
                "--sixth-color": "#DCEAE7",
                "--seventh-color": "#D3E1DC",
                "--fourth-color": "#3f5c5b",
                "--card-color1": "#3f5c5b",
                "--card-color2": "#edf7f5"
            }
        },
        GoldenGlow: {
            protanopia: {
                "--primary-color": "#fbf2d3",
                "--third-color": "#f1c06c",
                "--fifth-color": "#F9EAD4",
                "--sixth-color": "#F3DEB7",
                "--seventh-color": "#ECD29C",
                "--fourth-color": "#6a4c2d",
                "--card-color1": "#6a4c2d",
                "--card-color2": "#fdf6dd"
            },
            deuteranopia: {
                "--primary-color": "#faf0d0",
                "--third-color": "#e8b763",
                "--fifth-color": "#F9EAD4",
                "--sixth-color": "#F3DEB7",
                "--seventh-color": "#ECD29C",
                "--fourth-color": "#6a4c2d",
                "--card-color1": "#6a4c2d",
                "--card-color2": "#fdf6dd"
            },
            tritanopia: {
                "--primary-color": "#faefd3",
                "--third-color": "#e2a963",
                "--fifth-color": "#F9EAD4",
                "--sixth-color": "#F3DEB7",
                "--seventh-color": "#ECD29C",
                "--fourth-color": "#6a4c2d",
                "--card-color1": "#6a4c2d",
                "--card-color2": "#fdf6dd"
            }
        }
    };

    const applyAccessibilityTheme = (themeName, mode) => {
        const theme = accessibleThemes[themeName] || accessibleThemes['ForestNight'];
        const selectedTheme = theme[mode] || theme['default'];

        for (const [key, value] of Object.entries(selectedTheme)) {
            document.documentElement.style.setProperty(key, value);
        }
    };

    const [mode, setMode] = useState("default");

    const handleThemeChange = (themeMode) => {
        setMode(themeMode);
        applyAccessibilityTheme(currentTheme, themeMode);
    };

    const protanopiaThirdColor = accessibleThemes[currentTheme].protanopia["--third-color"]
    const deuteranopiaThirdColor = accessibleThemes[currentTheme].deuteranopia["--third-color"]
    const tritanopiaThirdColor = accessibleThemes[currentTheme].tritanopia["--third-color"]

    return (
        <div style={{ display: 'flex', gap: '8px', padding: '0 10px 10px 2px' }}>
            <Button
                variant={mode === "protanopia" ? "contained" : "outlined"}
                style={{ backgroundColor: protanopiaThirdColor, color: "#ffffff" }}
                onClick={() => handleThemeChange("protanopia")}
            >
                Protanopia
            </Button>
            <Button
                variant={mode === "deuteranopia" ? "contained" : "outlined"}
                style={{ backgroundColor: deuteranopiaThirdColor, color: "#ffffff" }}
                onClick={() => handleThemeChange("deuteranopia")}
            >
                Deuteranopia
            </Button>
            <Button
                variant={mode === "tritanopia" ? "contained" : "outlined"}
                style={{ backgroundColor: tritanopiaThirdColor, color: "#ffffff" }}
                onClick={() => handleThemeChange("tritanopia")}
            >
                Tritanopia
            </Button>
        </div>
    )
}

export default Daltonismo
