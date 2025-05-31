use crate::{
    interface::{
        elements::{
            button::{Action, Button},
            error::Error,
            text::Text,
            Element, Elements,
        },
        session::SessionData,
    },
    position::{Alignments, HorizontalAlign, Position, VerticalAlign},
    size::Size,
};

use super::Screen;

pub fn load_multiplayer(terminal_size: &Size, data_option: &Option<SessionData>) -> Vec<Elements> {
    let mut elements: Vec<Elements> = Vec::new();
    let mut position = Position { x: 0, y: 0 };

    let alignments = Alignments {
        vertical: VerticalAlign::Top,
        horizontal: HorizontalAlign::Center,
    };

    position.align(alignments, terminal_size);

    let title_content = include_str!("assets/multiplayer.txt").to_string();
    let title = Text::new(position.move_bottom(12).clone(), title_content);

    elements.push(Elements::Text(title));

    if let Some(data) = data_option {
        let greeting = Text::new(
            position.move_bottom(20).clone(),
            format!("Welcome {} !", data.name),
        );

        let mut logout_button =
            Button::new(position.move_bottom(2).clone(), "Logout\n".to_string());
        logout_button.set_action(Action::Logout);

        elements.push(Elements::Text(greeting));
        elements.push(Elements::Button(logout_button));
    } else {
        let auth_error = Error::new(
            position.move_bottom(20).clone(),
            "Seems like you aren't logged in.".to_string(),
        );

        elements.push(Elements::Error(auth_error));
    }

    let mut back_button = Button::new(position.move_bottom(2).clone(), "Go back\n".to_string());
    back_button.set_action(Action::Render(Screen::Home));

    elements.push(Elements::Button(back_button));

    elements
}
