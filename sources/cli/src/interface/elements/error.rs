use super::Element;
use crate::{position::Position, size::Size, BACKGROUND_COLOR, ERROR_COLOR};
use std::fmt::Write;
use termion::color::{Bg, Fg, Rgb};

pub struct Error {
    position: Position,
    content: String,
    color: Fg<Rgb>,
    background_color: Bg<Rgb>,
}

impl Error {
    pub fn get_content(&self) -> String {
        let x = self.position.x;
        let mut y = self.position.y;
        let mut content = String::new();

        write!(
            content,
            "{}{}{}",
            termion::cursor::Goto(x, y),
            self.color,
            self.background_color
        )
        .unwrap();

        for it in self.content.char_indices() {
            write!(content, "{}", it.1).unwrap();

            if it.1 == '\n' && it.0 < self.content.len() {
                y += 1;

                write!(content, "{}", termion::cursor::Goto(x, y)).unwrap();
            }
        }

        content
    }

    pub fn set_content(&mut self, content: String) {
        let size = Size::from_str(&content);

        self.position.x -= if self.position.x > size.height {
            size.width / 2
        } else {
            0
        };

        self.position.y -= if self.position.y > size.height {
            size.height / 2
        } else {
            0
        };

        self.content = content;
    }
}

impl Element for Error {
    fn new(position: Position, content: String) -> Self {
        Self {
            position,
            content,
            color: Fg(BACKGROUND_COLOR),
            background_color: Bg(ERROR_COLOR),
        }
    }
}
