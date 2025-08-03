# Tipstiq

## Getting Started

### Prerequisites

To get a copy of this project up and running on your local machine, you will need the following software installed:

-   [Go](https://go.dev/doc/install) (version 1.22 or higher)
-   [Node.js](https://nodejs.org/en/download/) (LTS version recommended)
-   [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/tipstiqmain/Tipstiq.git](https://github.com/tipstiqmain/Tipstiq.git)
    cd Tipstiq
    ```

2.  **Install dependencies:**
    This project appears to use both Go and Node.js dependencies.

    For Go:
    ```bash
    go mod tidy
    ```

    For Node.js (in the `oa2` directory):
    ```bash
    cd oa2
    npm install
    cd ..
    ```

3.  **Set up environment variables:**
    Before running the application, you need to set up your environment variables, including the Google OAuth secrets you just handled.

    Create a file named `.env` in the root of your project and add the following:
    ```
    GOOGLE_CLIENT_ID="[Your Google Client ID]"
    GOOGLE_CLIENT_SECRET="[Your Google Client Secret]"
    # Add any other environment variables here
    ```

    Replace the placeholders with your actual secrets.

## Usage

To start the development server, run the appropriate command for your application. If you are running both a Go backend and a Next.js frontend, you will need to start both.

### Running the Go Backend

```bash
go run .
```

### Running the Next.js Frontend

```bash
npm run dev
```

The application should now be running and accessible at `http://localhost:3000` (or the port specified in your configuration).

## Contributing

We welcome contributions! Please feel free to open issues or submit pull requests.

## License

This project is licensed under the [Your License Here] License - see the `LICENSE` file for details.
