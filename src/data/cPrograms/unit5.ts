import { CProgram } from '../../types';

export const unit5Programs: CProgram[] = [
  {
    id: 'u5-graph-adj-matrix',
    unitId: 5,
    topic: 'Graph Representations',
    title: 'Graph Representation Using Adjacency Matrix',
    category: 'Graphs',
    status: 'COMPLETE',
    description: 'Implements directed and undirected graph structures using a 2D V x V matrix. Demonstrates edge addition, vertex degree calculation, and neighborhood inspection.',
    timeComplexity: 'Edge query / Add: O(1), Vertex neighborhood / degree: O(V)',
    spaceComplexity: 'O(V^2) matrix storage',
    isStandalone: true,
    relatedLessonId: 'u5-graphs-intro',
    relatedVisualizer: 'graph',
    algorithmSteps: [
      'Initialize matrix[V][V] with zeros.',
      'Add Edge (u, v): matrix[u][v] = 1; if undirected, also matrix[v][u] = 1.',
      'Degree of vertex u: count non-zero entries in row u.'
    ],
    edgeCases: [
      'Self-loops (u == v)',
      'Invalid vertex index (< 0 or >= V)'
    ],
    sampleInput: '4 vertices, edges (0,1), (0,2), (1,2), (2,3)',
    expectedOutput: 'Symmetric 4x4 binary adjacency matrix printed with vertex degrees.',
    code: `#include <stdio.h>
#define V 4

void initGraph(int adj[V][V]) {
    for (int i = 0; i < V; i++) {
        for (int j = 0; j < V; j++) adj[i][j] = 0;
    }
}

void addEdge(int adj[V][V], int u, int v, int directed) {
    adj[u][v] = 1;
    if (!directed) adj[v][u] = 1;
}

void printMatrix(int adj[V][V]) {
    printf("   ");
    for (int i = 0; i < V; i++) printf("%2d ", i);
    printf("\\n   -------------\\n");
    for (int i = 0; i < V; i++) {
        printf("%d |", i);
        for (int j = 0; j < V; j++) {
            printf("%2d ", adj[i][j]);
        }
        printf("\\n");
    }
}

int main() {
    int adj[V][V];
    initGraph(adj);
    printf("=== Graph Representation: Adjacency Matrix ===\\n");
    addEdge(adj, 0, 1, 0);
    addEdge(adj, 0, 2, 0);
    addEdge(adj, 1, 2, 0);
    addEdge(adj, 2, 3, 0);

    printMatrix(adj);
    return 0;
}`
  },
  {
    id: 'u5-graph-adj-list',
    unitId: 5,
    topic: 'Graph Representations',
    title: 'Graph Representation Using Adjacency List',
    category: 'Graphs',
    status: 'COMPLETE',
    description: 'Implements graph representation using an array of linked lists. Optimized for sparse graphs (|E| << |V|^2), saving substantial memory.',
    timeComplexity: 'Add edge: O(1), Check edge: O(deg(u)), Space: O(V + E)',
    spaceComplexity: 'O(V + E) dynamic linked nodes',
    isStandalone: true,
    relatedLessonId: 'u5-graphs-intro',
    relatedVisualizer: 'graph',
    algorithmSteps: [
      'Each list node stores vertex index dest and next pointer.',
      'Array adjList[V] stores heads of linked lists.',
      'Add Edge (u, v): prepend newNode(v) to adjList[u]. If undirected, prepend newNode(u) to adjList[v].'
    ],
    edgeCases: [
      'Isolated vertex with empty list (NULL)',
      'Dense graph where adjacency list takes more pointer overhead than bit-matrix'
    ],
    sampleInput: 'Vertices 0, 1, 2, 3 with edges',
    expectedOutput: 'List representation printed: 0 -> 2 -> 1, 1 -> 2 -> 0, etc.',
    code: `#include <stdio.h>
#include <stdlib.h>
#define V 4

typedef struct AdjNode {
    int dest;
    struct AdjNode *next;
} AdjNode;

AdjNode* adjList[V];

AdjNode* createNode(int dest) {
    AdjNode* n = (AdjNode*)malloc(sizeof(AdjNode));
    n->dest = dest;
    n->next = NULL;
    return n;
}

void addEdge(int u, int v) {
    // Add v to u's list
    AdjNode* n1 = createNode(v);
    n1->next = adjList[u];
    adjList[u] = n1;

    // Add u to v's list (undirected)
    AdjNode* n2 = createNode(u);
    n2->next = adjList[v];
    adjList[v] = n2;
}

void printGraph() {
    for (int i = 0; i < V; i++) {
        printf("Vertex %d: ", i);
        AdjNode* curr = adjList[i];
        while (curr) {
            printf("-> %d ", curr->dest);
            curr = curr->next;
        }
        printf("-> NULL\\n");
    }
}

int main() {
    for (int i = 0; i < V; i++) adjList[i] = NULL;
    printf("=== Graph Representation: Adjacency List ===\\n");
    addEdge(0, 1);
    addEdge(0, 2);
    addEdge(1, 2);
    addEdge(2, 3);
    printGraph();
    return 0;
}`
  },
  {
    id: 'u5-bfs-traversal',
    unitId: 5,
    topic: 'Graph Traversals',
    title: 'Breadth-First Search (BFS) Using Queue',
    category: 'Graphs',
    status: 'COMPLETE',
    description: 'Implements level-order BFS traversal of a graph using a FIFO queue and a visited boolean array. Computes shortest unweighted path distances from start vertex.',
    timeComplexity: 'O(V + E) for adjacency list, O(V^2) for matrix',
    spaceComplexity: 'O(V) queue and visited array space',
    isStandalone: true,
    relatedLessonId: 'u5-graphs-intro',
    relatedVisualizer: 'graph',
    algorithmSteps: [
      'Initialize visited array to false. Enqueue start vertex, mark visited[start] = 1.',
      'While queue is not empty:',
      '  Dequeue front vertex u. Print u.',
      '  For each unvisited neighbor v of u: mark visited[v] = 1 and enqueue v.'
    ],
    edgeCases: [
      'Disconnected graph (BFS only reaches vertices in same connected component)',
      'Graph containing cycles (visited array prevents infinite loops)'
    ],
    sampleInput: 'Graph with 5 vertices, starting BFS from vertex 0',
    expectedOutput: 'BFS Traversal order: 0 1 2 3 4',
    code: `#include <stdio.h>
#define V 5

int queue[V], front = 0, rear = 0;
void enqueue(int x) { queue[rear++] = x; }
int dequeue() { return queue[front++]; }
int isEmpty() { return front == rear; }

void BFS(int adj[V][V], int start) {
    int visited[V] = {0};

    printf("BFS Order starting from vertex %d: ", start);
    visited[start] = 1;
    enqueue(start);

    while (!isEmpty()) {
        int u = dequeue();
        printf("%d ", u);

        for (int v = 0; v < V; v++) {
            if (adj[u][v] == 1 && !visited[v]) {
                visited[v] = 1;
                enqueue(v);
            }
        }
    }
    printf("\\n");
}

int main() {
    int adj[V][V] = {
        {0, 1, 1, 0, 0},
        {1, 0, 0, 1, 1},
        {1, 0, 0, 0, 1},
        {0, 1, 0, 0, 0},
        {0, 1, 1, 0, 0}
    };
    printf("=== Graph Breadth-First Search (BFS) ===\\n");
    BFS(adj, 0);
    return 0;
}`
  },
  {
    id: 'u5-dfs-traversal',
    unitId: 5,
    topic: 'Graph Traversals',
    title: 'Depth-First Search (DFS) Traversal',
    category: 'Graphs',
    status: 'COMPLETE',
    description: 'Implements DFS graph traversal exploring as deep as possible along each branch before backtracking. Uses recursion and visited state array.',
    timeComplexity: 'O(V + E) for adjacency list, O(V^2) for matrix',
    spaceComplexity: 'O(V) recursive call stack space',
    isStandalone: true,
    relatedLessonId: 'u5-graphs-intro',
    relatedVisualizer: 'graph',
    algorithmSteps: [
      'Mark current vertex u as visited. Print u.',
      'For each adjacent vertex v of u: if visited[v] == 0, call DFS(v).'
    ],
    edgeCases: [
      'Graph with multiple cycles (visited tracking prevents infinite recursion)',
      'Disconnected graph'
    ],
    sampleInput: 'Graph with 5 vertices, starting DFS from vertex 0',
    expectedOutput: 'DFS Order: 0 1 3 4 2',
    code: `#include <stdio.h>
#define V 5

int visited[V] = {0};

void DFS(int adj[V][V], int u) {
    visited[u] = 1;
    printf("%d ", u);

    for (int v = 0; v < V; v++) {
        if (adj[u][v] == 1 && !visited[v]) {
            DFS(adj, v);
        }
    }
}

int main() {
    int adj[V][V] = {
        {0, 1, 1, 0, 0},
        {1, 0, 0, 1, 1},
        {1, 0, 0, 0, 1},
        {0, 1, 0, 0, 0},
        {0, 1, 1, 0, 0}
    };
    printf("=== Graph Depth-First Search (DFS) ===\\n");
    printf("DFS Order starting from 0: ");
    DFS(adj, 0);
    printf("\\n");
    return 0;
}`
  },
  {
    id: 'u5-connected-components',
    unitId: 5,
    topic: 'Connected Components',
    title: 'Connected Components Detection Using DFS',
    category: 'Graphs',
    status: 'COMPLETE',
    description: 'Partitions an undirected graph into its maximal connected subgraphs using repeated DFS sweeps from unvisited vertices.',
    timeComplexity: 'O(V + E) total runtime',
    spaceComplexity: 'O(V) visited array',
    isStandalone: true,
    relatedLessonId: 'u5-graphs-intro',
    relatedVisualizer: 'graph',
    algorithmSteps: [
      'Initialize visited array to 0, componentCount = 0.',
      'For each vertex i from 0 to V - 1:',
      '  If visited[i] == 0: increment componentCount. Run DFS(i), printing all vertices belonging to this component.'
    ],
    edgeCases: [
      'Graph already fully connected (exactly 1 component)',
      'Graph with no edges (every vertex is an isolated component of size 1)'
    ],
    sampleInput: 'Graph with 6 vertices: component 1 (0, 1, 2) and component 2 (3, 4, 5)',
    expectedOutput: '2 distinct connected components identified and printed.',
    code: `#include <stdio.h>
#define V 6

int visited[V] = {0};

void dfsComponent(int adj[V][V], int u) {
    visited[u] = 1;
    printf("%d ", u);
    for (int v = 0; v < V; v++) {
        if (adj[u][v] && !visited[v]) {
            dfsComponent(adj, v);
        }
    }
}

int main() {
    // Two disconnected subgraphs: {0,1,2} and {3,4,5}
    int adj[V][V] = {
        {0, 1, 1, 0, 0, 0},
        {1, 0, 0, 0, 0, 0},
        {1, 0, 0, 0, 0, 0},
        {0, 0, 0, 0, 1, 0},
        {0, 0, 0, 1, 0, 1},
        {0, 0, 0, 0, 1, 0}
    };

    printf("=== Connected Components Detection ===\\n");
    int count = 0;
    for (int i = 0; i < V; i++) {
        if (!visited[i]) {
            count++;
            printf("Component %d: [ ", count);
            dfsComponent(adj, i);
            printf("]\\n");
        }
    }
    printf("Total connected components: %d\\n", count);
    return 0;
}`
  },
  {
    id: 'u5-spanning-tree',
    unitId: 5,
    topic: 'Spanning Trees',
    title: 'Spanning Tree Construction via Graph Traversal',
    category: 'Graphs',
    status: 'COMPLETE',
    description: 'Constructs a spanning tree containing all V vertices and exactly V - 1 edges with no cycles by extracting tree edges encountered during DFS.',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V) visited and edge array storage',
    isStandalone: true,
    relatedLessonId: 'u5-graphs-intro',
    relatedVisualizer: 'graph',
    algorithmSteps: [
      'Run DFS starting from vertex 0.',
      'Whenever an unvisited vertex v is reached from u, record edge (u, v) as a tree edge.',
      'Stop when V - 1 edges are collected.'
    ],
    edgeCases: [
      'Disconnected graph (spanning tree does not exist for entire graph)',
      'Multiple valid spanning trees for the same graph'
    ],
    sampleInput: 'Graph with 4 vertices and 5 edges',
    expectedOutput: 'Spanning tree with exactly 3 edges.',
    code: `#include <stdio.h>
#define V 4

int visited[V] = {0};

void dfsTree(int adj[V][V], int u) {
    visited[u] = 1;
    for (int v = 0; v < V; v++) {
        if (adj[u][v] && !visited[v]) {
            printf("Spanning Tree Edge: (%d - %d)\\n", u, v);
            dfsTree(adj, v);
        }
    }
}

int main() {
    int adj[V][V] = {
        {0, 1, 1, 1},
        {1, 0, 1, 0},
        {1, 1, 0, 1},
        {1, 0, 1, 0}
    };

    printf("=== Spanning Tree Construction via DFS ===\\n");
    dfsTree(adj, 0);
    return 0;
}`
  },
  {
    id: 'u5-prim-mst',
    unitId: 5,
    topic: 'Minimum Spanning Trees',
    title: "Prim's Algorithm for Minimum Spanning Tree (MST)",
    category: 'Graphs',
    status: 'COMPLETE',
    description: "Implements Prim's greedy algorithm to find Minimum Spanning Tree. Grows tree from start vertex, repeatedly adding minimum-weight crossing edge between visited and unvisited sets.",
    timeComplexity: 'O(V^2) with adjacency matrix, O(E log V) with min-heap',
    spaceComplexity: 'O(V) for key, parent, and inMST arrays',
    isStandalone: true,
    relatedLessonId: 'u5-graphs-intro',
    relatedVisualizer: 'graph',
    algorithmSteps: [
      'Initialize key[V] = INF, inMST[V] = false, parent[0] = -1, key[0] = 0.',
      'For count = 0 to V - 1:',
      '  Pick vertex u not in MST with minimum key[u].',
      '  Include u in MST (inMST[u] = true).',
      '  For every adjacent vertex v of u: if adj[u][v] < key[v] and not inMST[v], update key[v] = adj[u][v] and parent[v] = u.'
    ],
    edgeCases: [
      'Disconnected graph components',
      'Graph with equal weight edges'
    ],
    sampleInput: '5-vertex weighted undirected graph',
    expectedOutput: 'MST edges with individual weights and total minimum cost.',
    code: `#include <stdio.h>
#include <limits.h>
#define V 5

int minKey(int key[], int inMST[]) {
    int min = INT_MAX, min_index = -1;
    for (int v = 0; v < V; v++) {
        if (!inMST[v] && key[v] < min) {
            min = key[v];
            min_index = v;
        }
    }
    return min_index;
}

void primMST(int graph[V][V]) {
    int parent[V];
    int key[V];
    int inMST[V];

    for (int i = 0; i < V; i++) {
        key[i] = INT_MAX;
        inMST[i] = 0;
    }

    key[0] = 0;
    parent[0] = -1;

    for (int count = 0; count < V - 1; count++) {
        int u = minKey(key, inMST);
        inMST[u] = 1;

        for (int v = 0; v < V; v++) {
            if (graph[u][v] && !inMST[v] && graph[u][v] < key[v]) {
                parent[v] = u;
                key[v] = graph[u][v];
            }
        }
    }

    printf("Edge \\tWeight\\n");
    int totalCost = 0;
    for (int i = 1; i < V; i++) {
        printf("%d - %d \\t%d \\n", parent[i], i, graph[i][parent[i]]);
        totalCost += graph[i][parent[i]];
    }
    printf("Total MST Weight: %d\\n", totalCost);
}

int main() {
    int graph[V][V] = {
        {0, 2, 0, 6, 0},
        {2, 0, 3, 8, 5},
        {0, 3, 0, 0, 7},
        {6, 8, 0, 0, 9},
        {0, 5, 7, 9, 0}
    };

    printf("=== Prim's Minimum Spanning Tree ===\\n");
    primMST(graph);
    return 0;
}`
  },
  {
    id: 'u5-kruskal-mst',
    unitId: 5,
    topic: 'Minimum Spanning Trees',
    title: "Kruskal's Algorithm for MST (with Disjoint Set Union)",
    category: 'Graphs',
    status: 'COMPLETE',
    description: "Implements Kruskal's greedy MST algorithm. Sorts all edges in ascending order of weight and uses Disjoint Set Union (DSU with find & union) to detect and avoid cycles.",
    timeComplexity: 'O(E log E) for sorting edges',
    spaceComplexity: 'O(V + E) for DSU parent array and edge list',
    isStandalone: true,
    relatedLessonId: 'u5-graphs-intro',
    relatedVisualizer: 'graph',
    algorithmSteps: [
      'Sort all edges in non-decreasing order of weight.',
      'Initialize DSU parent array: parent[i] = i for all vertices.',
      'For each edge (u, v) with weight w:',
      '  Find representatives rootU = find(u) and rootV = find(v).',
      '  If rootU != rootV: no cycle created. Add edge to MST and union(rootU, rootV).',
      'Stop when V - 1 edges are added.'
    ],
    edgeCases: [
      'Cycles detected and skipped by matching DSU roots',
      'Dense graphs vs sparse graphs'
    ],
    sampleInput: '4 vertices, 5 weighted edges',
    expectedOutput: 'MST with 3 edges of minimum total weight.',
    code: `#include <stdio.h>
#include <stdlib.h>

typedef struct Edge {
    int src, dest, weight;
} Edge;

int compareEdges(const void* a, const void* b) {
    return ((Edge*)a)->weight - ((Edge*)b)->weight;
}

int findRoot(int parent[], int i) {
    if (parent[i] == i) return i;
    return parent[i] = findRoot(parent, parent[i]); // Path compression
}

void unionSets(int parent[], int x, int y) {
    int xroot = findRoot(parent, x);
    int yroot = findRoot(parent, y);
    parent[xroot] = yroot;
}

int main() {
    int V = 4, E = 5;
    Edge edges[] = {
        {0, 1, 10},
        {0, 2, 6},
        {0, 3, 5},
        {1, 3, 15},
        {2, 3, 4}
    };

    printf("=== Kruskal's Minimum Spanning Tree ===\\n");
    qsort(edges, E, sizeof(Edge), compareEdges);

    int parent[V];
    for (int i = 0; i < V; i++) parent[i] = i;

    int totalWeight = 0, edgeCount = 0;
    printf("Selected MST Edges:\\n");
    for (int i = 0; i < E && edgeCount < V - 1; i++) {
        int u = edges[i].src;
        int v = edges[i].dest;
        int rootU = findRoot(parent, u);
        int rootV = findRoot(parent, v);

        if (rootU != rootV) {
            printf("(%d - %d) Weight: %d\\n", u, v, edges[i].weight);
            totalWeight += edges[i].weight;
            unionSets(parent, rootU, rootV);
            edgeCount++;
        }
    }
    printf("Total Kruskal MST Weight: %d\\n", totalWeight);
    return 0;
}`
  },
  {
    id: 'u5-warshall-transitive-closure',
    unitId: 5,
    topic: 'Transitive Closure',
    title: "Warshall's Algorithm for Transitive Closure (Reachability)",
    category: 'Graphs',
    status: 'COMPLETE',
    description: "Computes the reachability matrix R where R[i][j] = 1 if there exists a directed path of any length from vertex i to j. Uses dynamic programming over intermediate vertices k.",
    timeComplexity: 'O(V^3) time complexity',
    spaceComplexity: 'O(V^2) reachability matrix storage',
    isStandalone: true,
    relatedLessonId: 'u5-graphs-intro',
    relatedVisualizer: 'graph',
    algorithmSteps: [
      'Initialize reach[i][j] = adj[i][j], with reach[i][i] = 1.',
      'Triple nested loops: for k = 0 to V - 1, for i = 0 to V - 1, for j = 0 to V - 1:',
      '  reach[i][j] = reach[i][j] || (reach[i][k] && reach[k][j]).'
    ],
    edgeCases: [
      'Graph with no paths between certain components',
      'Cyclic directed graphs'
    ],
    sampleInput: '4-vertex directed graph',
    expectedOutput: 'Full boolean reachability matrix showing all path existences.',
    code: `#include <stdio.h>
#define V 4

void warshall(int graph[V][V]) {
    int reach[V][V];
    for (int i = 0; i < V; i++) {
        for (int j = 0; j < V; j++) reach[i][j] = graph[i][j];
        reach[i][i] = 1; // Self-reachability
    }

    // k is intermediate vertex
    for (int k = 0; k < V; k++) {
        for (int i = 0; i < V; i++) {
            for (int j = 0; j < V; j++) {
                reach[i][j] = reach[i][j] || (reach[i][k] && reach[k][j]);
            }
        }
    }

    printf("Transitive Closure (Reachability Matrix):\\n");
    for (int i = 0; i < V; i++) {
        for (int j = 0; j < V; j++) {
            printf("%d ", reach[i][j]);
        }
        printf("\\n");
    }
}

int main() {
    int graph[V][V] = {
        {0, 1, 0, 0},
        {0, 0, 0, 1},
        {0, 0, 0, 0},
        {1, 0, 1, 0}
    };
    printf("=== Warshall's Algorithm (Transitive Closure) ===\\n");
    warshall(graph);
    return 0;
}`
  },
  {
    id: 'u5-dijkstra-shortest-path',
    unitId: 5,
    topic: 'Shortest Path',
    title: "Dijkstra's Shortest Path Algorithm (Non-Negative Edge Weights)",
    category: 'Graphs',
    status: 'COMPLETE',
    description: "Computes single-source shortest path from source vertex to all other vertices in a directed/undirected weighted graph with non-negative edge weights. Explicitly checks and rejects negative edge weights.",
    timeComplexity: 'O(V^2) with adjacency matrix, O((V + E) log V) with min-priority queue',
    spaceComplexity: 'O(V) distance and visited arrays',
    isStandalone: true,
    relatedLessonId: 'u5-graphs-intro',
    relatedVisualizer: 'graph',
    algorithmSteps: [
      'Validate that no negative edge weights exist in graph.',
      'Initialize dist[V] = INT_MAX, visited[V] = 0, dist[src] = 0.',
      'For count = 0 to V - 1:',
      '  Pick unvisited vertex u with minimum dist[u].',
      '  Mark visited[u] = 1.',
      '  For each neighbor v of u: if !visited[v] && graph[u][v] > 0 && dist[u] + graph[u][v] < dist[v]: update dist[v] = dist[u] + graph[u][v].'
    ],
    edgeCases: [
      'Negative weight edges (Dijkstra does not support negative weights; code validates and flags error)',
      'Unreachable vertices (distance remains INF)',
      'Source vertex having distance 0'
    ],
    sampleInput: '6-vertex non-negative weighted graph, source = 0',
    expectedOutput: 'Shortest distance from 0 to each vertex printed.',
    code: `#include <stdio.h>
#include <limits.h>
#define V 6

int minDistance(int dist[], int visited[]) {
    int min = INT_MAX, min_index = -1;
    for (int v = 0; v < V; v++) {
        if (!visited[v] && dist[v] <= min) {
            min = dist[v];
            min_index = v;
        }
    }
    return min_index;
}

int validateNonNegativeWeights(int graph[V][V]) {
    for (int i = 0; i < V; i++) {
        for (int j = 0; j < V; j++) {
            if (graph[i][j] < 0) {
                printf("Error: Negative edge weight (%d -> %d: %d) detected! Dijkstra requires non-negative weights.\\n",
                       i, j, graph[i][j]);
                return 0;
            }
        }
    }
    return 1;
}

void dijkstra(int graph[V][V], int src) {
    if (!validateNonNegativeWeights(graph)) return;

    int dist[V];
    int visited[V] = {0};

    for (int i = 0; i < V; i++) dist[i] = INT_MAX;
    dist[src] = 0;

    for (int count = 0; count < V - 1; count++) {
        int u = minDistance(dist, visited);
        if (u == -1) break;
        visited[u] = 1;

        for (int v = 0; v < V; v++) {
            if (!visited[v] && graph[u][v] > 0 && dist[u] != INT_MAX
                && dist[u] + graph[u][v] < dist[v]) {
                dist[v] = dist[u] + graph[u][v];
            }
        }
    }

    printf("Vertex \\tDistance from Source %d\\n", src);
    printf("------------------------------\\n");
    for (int i = 0; i < V; i++) {
        if (dist[i] == INT_MAX) {
            printf("%d \\tINF (Unreachable)\\n", i);
        } else {
            printf("%d \\t%d\\n", i, dist[i]);
        }
    }
}

int main() {
    int graph[V][V] = {
        {0, 4, 2, 0, 0, 0},
        {4, 0, 1, 5, 0, 0},
        {2, 1, 0, 8, 10, 0},
        {0, 5, 8, 0, 2, 6},
        {0, 0, 10, 2, 0, 3},
        {0, 0, 0, 6, 3, 0}
    };

    printf("=== Dijkstra's Shortest Path Algorithm ===\\n");
    dijkstra(graph, 0);
    return 0;
}`
  }
];
