use super::Element;
use crate::{position::Position, size::Size, BACKGROUND_COLOR, COLOR};
use std::fmt::Write;
use termion::color::{Bg, Fg, Rgb};

pub struct Text {
    position: Position,
    content: String,
    color: Fg<Rgb>,
    background_color: Bg<Rgb>,
}
impl Text {
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
}

impl Element for Text {
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
            color: Fg(COLOR),
            background_color: Bg(BACKGROUND_COLOR),
        }
    }
}
