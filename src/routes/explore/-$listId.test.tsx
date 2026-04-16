import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createMemoryHistory,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { routeTree } from "@/routeTree.gen";

vi.mock("@/hooks/useList");
vi.mock("@hono/auth-js/react", () => ({
  useSession: vi.fn(),
  signIn: vi.fn(),
}));

import { useSession } from "@hono/auth-js/react";
import {
  useAcceptChallenge,
  useExplore,
  useExploreDetail,
  useExploreItems,
} from "@/hooks/useList";

function renderDetailPage(listId = "list-detail-1") {
  const qc = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  const history = createMemoryHistory({
    initialEntries: [`/explore/${listId}`],
  });
  const router = createRouter({
    routeTree,
    history,
    context: { queryClient: qc },
  });
  return render(
    <QueryClientProvider client={qc}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

function setupBaseMocks() {
  vi.mocked(useSession).mockReturnValue({
    data: null,
    status: "unauthenticated",
    update: vi.fn(),
  } as never);
  vi.mocked(useExplore).mockReturnValue({
    data: { pages: [{ items: [], nextCursor: null }], pageParams: [] },
    isLoading: false,
    isFetchingNextPage: false,
    hasNextPage: false,
    fetchNextPage: vi.fn(),
  } as never);
  vi.mocked(useAcceptChallenge).mockReturnValue({
    mutate: vi.fn(),
    isPending: false,
  } as never);
  vi.mocked(useExploreItems).mockReturnValue({
    data: [],
    isLoading: false,
  } as never);
}

beforeEach(() => vi.clearAllMocks());

describe("ExploreDetailPage", () => {
  it("renders loading skeleton while detail is loading", async () => {
    setupBaseMocks();
    vi.mocked(useExploreDetail).mockReturnValue({
      data: undefined,
      isLoading: true,
    } as never);

    renderDetailPage();

    await waitFor(() => {
      const skeletons = document.querySelectorAll(".animate-pulse");
      expect(skeletons.length).toBeGreaterThan(0);
    });
    expect(
      screen.queryByTestId("accept-challenge-btn")
    ).not.toBeInTheDocument();
  });

  it("renders detail page with participants", async () => {
    setupBaseMocks();
    vi.mocked(useExploreDetail).mockReturnValue({
      data: {
        id: "list-detail-1",
        name: "Lista Detalle",
        slug: null,
        description: "Una descripción",
        itemCount: 3,
        participantCount: 2,
        ownerId: "owner-1",
        owner: { name: "Ana", image: "https://example.com/ana.jpg" },
        participants: [
          { name: "Ana", image: "https://example.com/ana.jpg" },
          { name: "Bob", image: null },
        ],
      },
      isLoading: false,
    } as never);

    renderDetailPage();

    await waitFor(() =>
      expect(screen.getByText("Lista Detalle")).toBeInTheDocument()
    );
    expect(screen.getByText("Una descripción")).toBeInTheDocument();
    expect(screen.getByTestId("accept-challenge-btn")).toBeInTheDocument();
  });

  it("renders participant avatars with index-based keys (no duplicate key warnings)", async () => {
    setupBaseMocks();
    vi.mocked(useExploreDetail).mockReturnValue({
      data: {
        id: "list-detail-1",
        name: "Lista Detalle",
        slug: null,
        description: null,
        itemCount: 2,
        participantCount: 3,
        ownerId: "owner-1",
        owner: null,
        participants: [
          { name: "Ana", image: "https://example.com/img.jpg" },
          { name: "Ana", image: "https://example.com/img.jpg" },
        ],
      },
      isLoading: false,
    } as never);

    renderDetailPage();

    await waitFor(() =>
      expect(screen.getByText("Lista Detalle")).toBeInTheDocument()
    );
    const avatars = document.querySelectorAll("img.w-6.h-6.rounded-full");
    expect(avatars).toHaveLength(2);
  });
});
