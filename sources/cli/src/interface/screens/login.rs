use crate::{
    interface::elements::{
        button::{Action, Button},
        error::Error,
        input::Input,
        text::Text,
        Element, Elements,
    },
    position::{Alignments, HorizontalAlign, Position, VerticalAlign},
    size::Size,
};

use super::Screen;

pub fn load_login(terminal_size: &Size) -> Vec<Elements> {
    let mut elements: Vec<Elements> = Vec::new();
    let mut position = Position { x: 0, y: 0 };

    let mut alignments = Alignments {
        vertical: VerticalAlign::Top,
        horizontal: HorizontalAlign::Center,
    };

    position.align(alignments, terminal_size);

    let title_content = include_str!("assets/title.txt").to_string();
    let title = Text::new(position.move_bottom(12).clone(), title_content);

    alignments = Alignments {
        vertical: VerticalAlign::Bottom,
        horizontal: HorizontalAlign::Center,
    };

    position.align(alignments, terminal_size);

    let login_error = Error::new(position.move_top(20).clone(), String::new());

    let username_label = Text::new(position.move_bottom(4).clone(), "Username:\n".to_string());

    let username_input = Input::new(position.move_bottom(2).clone(), "name".to_string());

    let password_label = Text::new(position.move_bottom(2).clone(), "Password:\n".to_string());

    let mut password_input = Input::new(position.move_bottom(2).clone(), "password".to_string());
    password_input.set_hidden(true);

    let mut login_button = Button::new(position.move_bottom(4).clone(), "Login\n".to_string());
    login_button.set_action(Action::Login);

    let mut back_button = Button::new(position.move_bottom(2).clone(), "Go back\n".to_string());
    back_button.set_action(Action::Render(Screen::Home));

    elements.push(Elements::Text(title));
    elements.push(Elements::Error(login_error));
    elements.push(Elements::Text(username_label));
    elements.push(Elements::Input(username_input));
    elements.push(Elements::Text(password_label));
    elements.push(Elements::Input(password_input));
    elements.push(Elements::Button(login_button));
    elements.push(Elements::Button(back_button));

    elements
}
