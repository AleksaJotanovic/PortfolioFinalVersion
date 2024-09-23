import { Configurator } from "../models/configurator.model";

export const configurator: Configurator = {
    name: "",
    playfield: [
        { name: "Motherboard", product_id: "" },
        { name: "CPU", product_id: "" },
        { name: "GPU", product_id: "" },
        { name: "CPU Cooler", product_id: "" },
        { name: "RAM", product_id: "" },
        { name: "SSD", product_id: "" },
        { name: "HDD", product_id: "" },
        { name: "Case", product_id: "" },
        { name: "Power supply", product_id: "" },
        { name: "Monitor", product_id: "" },
        { name: "Operating system", product_id: "" },
        { name: "Optical drive", product_id: "" }
    ]
};

export const LOCAL_VAR = "configurator";