use interface::{Interface, Status};
use std::io::{stdin, stdout, Write};
use termion::{clear, color::Rgb, cursor, input::TermRead, raw::IntoRawMode, style};

mod interface;
mod position;
mod size;

const COLOR: Rgb = Rgb(255, 255, 255);
const BACKGROUND_COLOR: Rgb = Rgb(0, 0, 0);

fn main() {
    let mut interface = Interface::new();
    let mut stdout = stdout().into_raw_mode().unwrap();

    for input in stdin().keys() {
        match input {
            Ok(input) => interface.handle_input(input),
            Err(err) => panic!("Error: {err}"),
        };

        stdout.flush().unwrap();

        if *interface.get_status() == Status::Exit {
            print!(
                "{}{}{}{}",
                clear::All,
                style::Reset,
                cursor::Show,
                cursor::Restore
            );

            break;
        }
    }
}
