import elem from "../util/element"

export const genBackBtnContent = (): HTMLElement => {
    return elem('div', null, [
        elem('p', null, "This will lose your progress in the current game!"),
        elem('div', {class: "modal-buttons"}, [
            elem('button', {id: "confirm-back-btn"}, "Confirm"),
            elem('button', {id: "cancel-back-btn"}, "Cancel"),
        ])
    ])
    
}