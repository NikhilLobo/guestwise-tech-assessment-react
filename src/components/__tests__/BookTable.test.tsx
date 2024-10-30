import { render, screen, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import userEvent from "@testing-library/user-event";
import BookTable from "../BookTable";

const queryClient = new QueryClient();

beforeEach(() => {
  jest.spyOn(global, "fetch").mockResolvedValue({
    ok: true,
    json: async () => ({}),
  } as Response);
});

afterEach(() => {
  jest.restoreAllMocks();
});

function renderWithClient(ui: React.ReactElement) {
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
}

describe("BookTable Component", () => {
  test("submits the booking form successfully with valid data", async () => {
    renderWithClient(<BookTable />);

    await userEvent.type(screen.getByLabelText(/name/i), "John Doe");
    await userEvent.type(
      screen.getByLabelText(/email/i),
      "john.doe@example.com"
    );
    await userEvent.type(screen.getByLabelText(/phone/i), "07485467789");

    const dateTimeInput = screen.getByLabelText(/date & time/i);
    fireEvent.change(dateTimeInput, { target: { value: "2024-10-31T19:30" } });

    await userEvent.type(screen.getByLabelText(/number of guests/i), "4");

    await userEvent.click(screen.getByRole("button", { name: /book table/i }));

    expect(await screen.findByText(/booking successful!/i)).toBeInTheDocument();
  });

  test("shows validation errors for missing required fields", async () => {
    renderWithClient(<BookTable />);

    await userEvent.click(screen.getByRole("button", { name: /book table/i }));

    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    expect(screen.getByText(/phone number is required/i)).toBeInTheDocument();
    expect(screen.getByText(/date and time are required/i)).toBeInTheDocument();
  });
});
