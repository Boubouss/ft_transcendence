use crate::{
    interface::{
        elements::{
            button::{Action, Button},
            text::Text,
            Element, Elements,
        },
        session::SessionData,
    },
    position::{Alignments, HorizontalAlign, Position, VerticalAlign},
    size::Size,
};

use super::Screen;

pub fn load_home(terminal_size: &Size, data_option: &Option<SessionData>) -> Vec<Elements> {
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

    elements.push(Elements::Text(title));

    if let Some(data) = data_option {
        let greeting = Text::new(
            position.move_top(15).clone(),
            format!("Welcome {} !", data.name),
        );

        let mut multiplayer_button =
            Button::new(position.move_bottom(2).clone(), "Multiplayer\n".to_string());
        multiplayer_button.set_action(Action::Exit);

        let mut logout_button =
            Button::new(position.move_bottom(2).clone(), "Logout\n".to_string());
        logout_button.set_action(Action::Logout);

        elements.push(Elements::Text(greeting));
        elements.push(Elements::Button(multiplayer_button));
        elements.push(Elements::Button(logout_button));
    } else {
        let mut login_button = Button::new(position.move_top(15).clone(), "Login\n".to_string());
        login_button.set_action(Action::Render(Screen::Login));

        elements.push(Elements::Button(login_button));
    }

    let mut exit_button = Button::new(position.move_bottom(2).clone(), "Exit\n".to_string());
    exit_button.set_action(Action::Exit);

    elements.push(Elements::Button(exit_button));

    elements
}
