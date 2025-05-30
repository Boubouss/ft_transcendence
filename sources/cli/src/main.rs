use interface::{Interface, Status};
use std::io::stdin;
use termion::{clear, color::Rgb, cursor, input::TermRead, style};

mod interface;
mod position;
mod size;

const COLOR: Rgb = Rgb(255, 255, 255);
const ERROR_COLOR: Rgb = Rgb(255, 0, 0);
const ACTIVE_COLOR: Rgb = Rgb(0, 255, 0);
const BACKGROUND_COLOR: Rgb = Rgb(0, 0, 0);

const USER_API_URL: &str = "https://localhost:3000";

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let mut interface = Interface::new();

    for input in stdin().keys() {
        let _ = match input {
            Ok(input) => interface.handle_input(input).await,
            Err(err) => panic!("Error: {err}"),
        };

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

    Ok(())
}
