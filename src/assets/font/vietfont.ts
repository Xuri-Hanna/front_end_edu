
import OpenSans from "@/assets/font/OpenSans-VariableFont_wdth,wght.ttf";
import Inter from "@/assets/font/Inter-VariableFont_opsz,wght.ttf"
import RobotoRegular from "@/assets/font/Roboto-VariableFont_wdth,wght.ttf";
import { jsPDF } from "jspdf";

export const OpenSansFont = (doc: jsPDF) => {
    doc.addFileToVFS("OpenSans-VariableFont_wdth,wght.ttf", OpenSans);
    doc.addFont("OpenSans-VariableFont_wdth,wght.ttf", "OpenSans", "normal");
};
