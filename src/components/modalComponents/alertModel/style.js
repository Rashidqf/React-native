import { StyleSheet } from "react-native";

import { COMMON_STYLE, COLORS, IMAGES } from "@themes";
import { Responsive } from "@helpers";

export const styles = StyleSheet.create({
    safeAreaStyle: {
        flex: 1,
        backgroundColor: COLORS.DARK_OPACITY,
        justifyContent: "center",
        alignItems: "center",
    },

    alertBoxStyle: {
        width: Responsive.getWidth(90),
        maxHeight: Responsive.getHeight(55),
        borderRadius: Responsive.getWidth(3),
        backgroundColor: COLORS.WHITE,
        alignItems: "center",
    },

    successBtnStyle: {
        ...COMMON_STYLE.fillBtnStyle(35),
    },
    cancelBtnStyle: {
        ...COMMON_STYLE.borderBtnStyle(35),
    },

    alertImageStyle: {
        height: Responsive.getWidth(8),
        width: Responsive.getWidth(8),
        borderRadius: Responsive.getWidth(2),
        resizeMode: "contain",
        marginTop: Responsive.getHeight(1),
        overflow: "hidden",
    },

    titleStyle: {
        ...COMMON_STYLE.textStyle(16, COLORS.ALERT_TITLE, "BOLD", "center"),
        margin: Responsive.getHeight(1),
        marginBottom: 0,
    },

    descriptionStyle: {
        ...COMMON_STYLE.textStyle(14, COLORS.ALERT_MSG, undefined, "center"),
        margin: Responsive.getHeight(1),
    },

    btnTitleStyle: (color) => {
        return { ...COMMON_STYLE.textStyle(12, color, "BOLD") };
    },

    btnStyle: {
        justifyContent: "center",
        alignItems: "center",
        height: Responsive.getHeight(5),
        flex: 1,
    },

    buttonViewStyle: {
        flexDirection: "row",
        justifyContent: "space-around",
        borderTopWidth: 1,
        borderColor: COLORS.ALERT_SEPRATOR,
        marginTop: Responsive.getHeight(1),
    },
});
