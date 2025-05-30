use super::Element;
use std::fmt::Write;
use termion::color::{Bg, Fg, Rgb};

use crate::{
    interface::screens::Screen, position::Position, size::Size, ACTIVE_COLOR, BACKGROUND_COLOR,
    COLOR,
};

pub enum Action {
    Render(Screen),
    Login,
    Logout,
    Exit,
}

pub struct Button {
    position: Position,
    content: String,
    action: Option<Action>,
    color: Fg<Rgb>,
    background_color: Bg<Rgb>,
}

impl Button {
    pub fn get_content(&self, is_active: bool) -> String {
        let x = self.position.x;
        let mut y = self.position.y;
        let mut content = String::new();

        write!(
            content,
            "{}{}",
            self.color,
            termion::cursor::Goto(self.position.x, self.position.y),
        )
        .unwrap();

        if is_active {
            write!(content, "{}", Bg(ACTIVE_COLOR)).unwrap();
        } else {
            write!(content, "{}", self.background_color).unwrap();
        }

        for it in self.content.char_indices() {
            write!(content, "{}", it.1).unwrap();

            if it.1 == '\n' && it.0 < self.content.len() {
                y += 1;

                write!(content, "{}", termion::cursor::Goto(x, y)).unwrap();
            }
        }

        content
    }

    pub fn get_action(&self) -> &Option<Action> {
        &self.action
    }

    pub fn set_action(&mut self, action: Action) {
        self.action = Some(action);
    }
}

impl Element for Button {
    fn new(mut position: Position, content: String) -> Self {
        let size = Size::from_str(&content);

        position.x -= if position.x > size.height {
            size.width / 2
        } else {
            0
        };

        position.y -= if position.y > size.height {
            size.height / 2
        } else {
            0
        };

        Self {
            position,
            content,
            action: None,
            color: Fg(BACKGROUND_COLOR),
            background_color: Bg(COLOR),
        }
    }
}
