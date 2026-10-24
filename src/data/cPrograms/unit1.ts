import { CProgram } from '../../types';

export const unit1Programs: CProgram[] = [
  {
    id: 'u1-array-crud',
    unitId: 1,
    topic: 'Array Operations',
    title: 'Array CRUD Operations (Insert, Delete, Traverse, Search)',
    category: 'Arrays',
    status: 'COMPLETE',
    description: 'Complete C implementation of linear array operations: insertion at any valid index with element shifting, deletion from an index with left-shifting, linear traversal, and value search.',
    timeComplexity: 'Insertion: O(n), Deletion: O(n), Search: O(n), Traversal: O(n)',
    spaceComplexity: 'O(1) auxiliary space (in-place array modifications)',
    isStandalone: true,
    relatedLessonId: 'u1-arrays-intro',
    relatedVisualizer: 'array',
    algorithmSteps: [
      'Insertion: Check if size >= CAPACITY (overflow). If valid, shift elements from index n-1 down to pos rightwards: arr[i+1] = arr[i]. Place new element at arr[pos] and increment size.',
      'Deletion: Check if size == 0 (underflow) or pos is invalid. Copy arr[pos] to store deleted value. Shift elements from pos+1 up to n-1 leftwards: arr[i-1] = arr[i]. Decrement size.',
      'Traversal: Loop from i = 0 to size - 1 and print each element.',
      'Search: Loop through array; if arr[i] matches target, return index i. If loop finishes without match, return -1.'
    ],
    edgeCases: [
      'Insertion into a full array (capacity overflow)',
      'Insertion at boundary positions: index 0 (requires shifting all n elements) and index size (append, no shifting)',
      'Deletion from an empty array (underflow check)',
      'Deletion at the last element (no shifting needed) vs index 0 (shifts all remaining elements)',
      'Search for element not present in the array'
    ],
    sampleInput: 'Initial array: [10, 20, 30, 40], Insert 25 at index 2, Delete element at index 1',
    expectedOutput: 'After insert: [10, 20, 25, 30, 40]\nAfter delete: [10, 25, 30, 40]',
    code: `#include <stdio.h>
#define CAPACITY 100

void display(int arr[], int size) {
    printf("[ ");
    for (int i = 0; i < size; i++) {
        printf("%d ", arr[i]);
    }
    printf("] (Size: %d)\\n", size);
}

int insertAt(int arr[], int *size, int capacity, int element, int index) {
    if (*size >= capacity) {
        printf("Error: Array Overflow! Cannot insert %d.\\n", element);
        return 0;
    }
    if (index < 0 || index > *size) {
        printf("Error: Invalid index %d for insertion.\\n", index);
        return 0;
    }
    // Shift elements to the right to create an empty slot
    for (int i = *size - 1; i >= index; i--) {
        arr[i + 1] = arr[i];
    }
    arr[index] = element;
    (*size)++;
    return 1;
}

int deleteAt(int arr[], int *size, int index, int *deletedValue) {
    if (*size <= 0) {
        printf("Error: Array Underflow! Cannot delete.\\n");
        return 0;
    }
    if (index < 0 || index >= *size) {
        printf("Error: Invalid index %d for deletion.\\n", index);
        return 0;
    }
    *deletedValue = arr[index];
    // Shift elements left to fill the vacancy
    for (int i = index; i < *size - 1; i++) {
        arr[i] = arr[i + 1];
    }
    (*size)--;
    return 1;
}

int linearSearch(int arr[], int size, int target) {
    for (int i = 0; i < size; i++) {
        if (arr[i] == target) return i;
    }
    return -1;
}

int main() {
    int arr[CAPACITY] = {10, 20, 30, 40};
    int size = 4;
    int deletedVal;

    printf("--- Array CRUD Demonstration ---\\n");
    printf("Initial Array: ");
    display(arr, size);

    // Insert 25 at index 2
    printf("\\nInserting 25 at index 2...\\n");
    insertAt(arr, &size, CAPACITY, 25, 2);
    display(arr, size);

    // Delete at index 1 (element 20)
    printf("\\nDeleting element at index 1...\\n");
    if (deleteAt(arr, &size, 1, &deletedVal)) {
        printf("Deleted value: %d\\n", deletedVal);
    }
    display(arr, size);

    // Search for 30
    int searchTarget = 30;
    int foundIdx = linearSearch(arr, size, searchTarget);
    if (foundIdx != -1) {
        printf("\\nElement %d found at index %d\\n", searchTarget, foundIdx);
    } else {
        printf("\\nElement %d not found\\n", searchTarget);
    }

    return 0;
}`
  },
  {
    id: 'u1-address-calc-1d-2d-3d',
    unitId: 1,
    topic: 'Memory Addressing',
    title: '1D, 2D (Row & Column Major), and 3D Address Calculation',
    category: 'Arrays',
    status: 'COMPLETE',
    description: 'Implements analytical address computation formulas for multidimensional arrays in C and compares the computed formula addresses against the actual compiler physical memory addresses (&arr[i][j]).',
    timeComplexity: 'O(1) address computation using algebraic formula',
    spaceComplexity: 'O(1) auxiliary space',
    isStandalone: true,
    relatedLessonId: 'u1-arrays-intro',
    relatedVisualizer: 'array',
    algorithmSteps: [
      '1D Formula: Address(A[i]) = Base + (i - LowerBound) * sizeof(element)',
      '2D Row-Major Formula: Address(A[i][j]) = Base + [(i - LBR) * N_cols + (j - LBC)] * sizeof(element)',
      '2D Column-Major Formula: Address(A[i][j]) = Base + [(j - LBC) * N_rows + (i - LBR)] * sizeof(element)',
      '3D Row-Major Formula: Address(A[i][j][k]) = Base + [(i - LB1) * (d2 * d3) + (j - LB2) * d3 + (k - LB3)] * sizeof(element)',
      'Verify by comparing formula result with pointer cast: (char*)&A[i][j] - (char*)Base.'
    ],
    edgeCases: [
      '0-based indexing (C language standard) vs 1-based indexing (mathematical/textbook exams)',
      'Non-unit element sizes (e.g. sizeof(int)=4, sizeof(double)=8)',
      'Boundary elements: first element (0,0,0) and last element (d1-1, d2-1, d3-1)'
    ],
    sampleInput: 'Matrix 3x4 of ints, querying element (2, 3)',
    expectedOutput: 'Calculated Row-Major Offset = 11 * 4 = 44 bytes. Physical Address matches exactly.',
    code: `#include <stdio.h>
#include <stdint.h>

void test2DAddressCalculation() {
    int rows = 3, cols = 4;
    int matrix[3][4];
    uintptr_t base = (uintptr_t)&matrix[0][0];
    int elementSize = sizeof(int);

    printf("=== 2D Array Address Calculation (Row-Major vs Col-Major) ===\\n");
    printf("Base Address (matrix[0][0]): %p\\n", (void*)base);
    printf("Dimensions: %d Rows x %d Columns, Element Size: %d bytes\\n\\n", rows, cols, elementSize);

    int targetRow = 2, targetCol = 3;

    // Row-Major: Address = Base + (i * cols + j) * size
    int rowMajorOffset = (targetRow * cols + targetCol) * elementSize;
    uintptr_t calcRowMajorAddr = base + rowMajorOffset;
    uintptr_t actualAddr = (uintptr_t)&matrix[targetRow][targetCol];

    printf("Querying element matrix[%d][%d]:\\n", targetRow, targetCol);
    printf("Row-Major Formula Offset: (%d * %d + %d) * %d = %d bytes\\n", 
           targetRow, cols, targetCol, elementSize, rowMajorOffset);
    printf("Calculated Address: %p\\n", (void*)calcRowMajorAddr);
    printf("Actual Address:     %p\\n", (void*)actualAddr);
    printf("Match: %s\\n\\n", (calcRowMajorAddr == actualAddr) ? "YES (100% Exact)" : "NO");

    // Column-Major: Address = Base + (j * rows + i) * size
    int colMajorOffset = (targetCol * rows + targetRow) * elementSize;
    uintptr_t calcColMajorAddr = base + colMajorOffset;
    printf("Column-Major Formula Offset (FORTRAN style): (%d * %d + %d) * %d = %d bytes\\n",
           targetCol, rows, targetRow, elementSize, colMajorOffset);
    printf("Calculated Col-Major Address: %p\\n", (void*)calcColMajorAddr);
}

void test3DAddressCalculation() {
    int d1 = 2, d2 = 3, d3 = 4;
    int arr3D[2][3][4];
    uintptr_t base = (uintptr_t)&arr3D[0][0][0];
    int elementSize = sizeof(int);

    printf("=== 3D Array Address Calculation (Row-Major) ===\\n");
    int i = 1, j = 2, k = 3;
    // Offset = [ i * (d2 * d3) + j * d3 + k ] * size
    int offset = (i * (d2 * d3) + j * d3 + k) * elementSize;
    uintptr_t calculated = base + offset;
    uintptr_t actual = (uintptr_t)&arr3D[i][j][k];

    printf("Querying arr3D[%d][%d][%d] in dimensions [%d][%d][%d]:\\n", i, j, k, d1, d2, d3);
    printf("Offset = [%d*(%d*%d) + %d*%d + %d] * %d = %d bytes\\n", i, d2, d3, j, d3, k, elementSize, offset);
    printf("Calculated Address: %p\\n", (void*)calculated);
    printf("Actual Address:     %p\\n", (void*)actual);
    printf("Match: %s\\n", (calculated == actual) ? "YES (100% Exact)" : "NO");
}

int main() {
    test2DAddressCalculation();
    printf("\\n");
    test3DAddressCalculation();
    return 0;
}`
  },
  {
    id: 'u1-sparse-matrix-triplet',
    unitId: 1,
    topic: 'Sparse Matrices',
    title: 'Sparse Matrix Triplet Representation & Simple Transpose',
    category: 'Arrays',
    status: 'COMPLETE',
    description: 'Compresses a 2D sparse matrix (mostly zeros) into a 3-column Triplet array (Row, Column, Value) where row 0 stores total rows, columns, and non-zero counts. Implements simple transpose of the triplet matrix.',
    timeComplexity: 'Triplet creation: O(rows * cols), Transpose: O(cols * num_non_zeros)',
    spaceComplexity: 'O(num_non_zeros) compressed storage',
    isStandalone: true,
    relatedLessonId: 'u1-arrays-intro',
    relatedVisualizer: 'array',
    algorithmSteps: [
      'Scan dense matrix: count non-zero elements k.',
      'Initialize triplet[0].row = total_rows, triplet[0].col = total_cols, triplet[0].val = k.',
      'For each non-zero element at (r, c), store in triplet[k]: row=r, col=c, val=matrix[r][c].',
      'Simple Transpose: Loop through column index c from 0 to total_cols - 1. For each triplet element whose col == c, insert into transpose triplet with swapped row and col.'
    ],
    edgeCases: [
      'Dense matrix with zero non-zero elements (pure zero matrix)',
      'Matrix where every element is non-zero (triplet takes more space than dense)',
      'Single row or single column matrix'
    ],
    sampleInput: '4x5 matrix with non-zeros at (0,2)=3, (0,4)=4, (1,2)=5, (1,3)=7, (3,1)=2, (3,2)=6',
    expectedOutput: 'Triplet representation with 6 non-zero entries, followed by transposed triplet.',
    code: `#include <stdio.h>
#define MAX 100

typedef struct {
    int row;
    int col;
    int val;
} Triplet;

void printTriplet(Triplet t[]) {
    int n = t[0].val;
    printf("Row\\tCol\\tValue\\n");
    printf("---------------------\\n");
    printf("%d\\t%d\\t%d (Header: Rows, Cols, Non-Zeros)\\n", t[0].row, t[0].col, t[0].val);
    for (int i = 1; i <= n; i++) {
        printf("%d\\t%d\\t%d\\n", t[i].row, t[i].col, t[i].val);
    }
}

void createTriplet(int r, int c, int matrix[r][c], Triplet t[]) {
    int k = 1;
    t[0].row = r;
    t[0].col = c;
    for (int i = 0; i < r; i++) {
        for (int j = 0; j < c; j++) {
            if (matrix[i][j] != 0) {
                t[k].row = i;
                t[k].col = j;
                t[k].val = matrix[i][j];
                k++;
            }
        }
    }
    t[0].val = k - 1; // Total non-zero count
}

void simpleTranspose(Triplet original[], Triplet transposed[]) {
    int totalCols = original[0].col;
    int nonZeros = original[0].val;
    
    // Header for transpose
    transposed[0].row = original[0].col;
    transposed[0].col = original[0].row;
    transposed[0].val = nonZeros;

    if (nonZeros <= 0) return;

    int k = 1;
    // Process columns in ascending order to ensure transposed rows remain sorted
    for (int c = 0; c < totalCols; c++) {
        for (int i = 1; i <= nonZeros; i++) {
            if (original[i].col == c) {
                transposed[k].row = original[i].col;
                transposed[k].col = original[i].row;
                transposed[k].val = original[i].val;
                k++;
            }
        }
    }
}

int main() {
    int r = 4, c = 5;
    int matrix[4][5] = {
        {0, 0, 3, 0, 4},
        {0, 0, 5, 7, 0},
        {0, 0, 0, 0, 0},
        {0, 2, 6, 0, 0}
    };

    Triplet original[MAX], transposed[MAX];

    printf("=== Sparse Matrix Triplet Representation ===\\n");
    createTriplet(r, c, matrix, original);
    printTriplet(original);

    printf("\\n=== Transposed Triplet Matrix ===\\n");
    simpleTranspose(original, transposed);
    printTriplet(transposed);

    return 0;
}`
  },
  {
    id: 'u1-linear-search',
    unitId: 1,
    topic: 'Searching',
    title: 'Linear Search with Sentinel Optimization',
    category: 'Searching',
    status: 'COMPLETE',
    description: 'Implements both standard linear search and the sentinel linear search optimization, which eliminates index boundary checks within the inner search loop.',
    timeComplexity: 'Best: O(1), Average: O(n), Worst: O(n)',
    spaceComplexity: 'O(1) auxiliary space',
    isStandalone: true,
    relatedLessonId: 'u1-searching-sorting',
    relatedVisualizer: 'array',
    algorithmSteps: [
      'Standard: Loop i from 0 to n-1. If arr[i] == target, return i. Else return -1.',
      'Sentinel: Save arr[n-1], set arr[n-1] = target. Loop without checking i < n. Once target is encountered, restore arr[n-1]. If found index < n-1 or original arr[n-1] == target, return index; else -1.'
    ],
    edgeCases: [
      'Target is the first element (best case O(1))',
      'Target is the last element',
      'Target is not present in the array (worst case O(n))',
      'Array contains duplicate values (returns first occurrence)'
    ],
    sampleInput: 'Array: [45, 12, 89, 34, 78, 23], Target: 34',
    expectedOutput: 'Element 34 found at index 3 with 4 comparisons.',
    code: `#include <stdio.h>

int standardLinearSearch(int arr[], int n, int target, int *comparisons) {
    *comparisons = 0;
    for (int i = 0; i < n; i++) {
        (*comparisons)++;
        if (arr[i] == target) {
            return i;
        }
    }
    return -1;
}

int sentinelLinearSearch(int arr[], int n, int target) {
    if (n == 0) return -1;
    int last = arr[n - 1];
    arr[n - 1] = target; // Set sentinel
    int i = 0;
    while (arr[i] != target) {
        i++;
    }
    arr[n - 1] = last; // Restore original value
    if (i < n - 1 || last == target) {
        return i;
    }
    return -1;
}

int main() {
    int arr[] = {45, 12, 89, 34, 78, 23};
    int n = sizeof(arr) / sizeof(arr[0]);
    int target = 34;
    int comparisons = 0;

    printf("=== Linear Search Demonstration ===\\n");
    int idx = standardLinearSearch(arr, n, target, &comparisons);
    if (idx != -1) {
        printf("Standard Search: Target %d found at index %d (Comparisons: %d)\\n", target, idx, comparisons);
    } else {
        printf("Standard Search: Target %d not found\\n", target);
    }

    int sentinelIdx = sentinelLinearSearch(arr, n, target);
    printf("Sentinel Search: Target %d found at index %d\\n", target, sentinelIdx);
    return 0;
}`
  },
  {
    id: 'u1-binary-search-iterative-recursive',
    unitId: 1,
    topic: 'Searching',
    title: 'Binary Search (Iterative & Recursive)',
    category: 'Searching',
    status: 'COMPLETE',
    description: 'Implements Binary Search on a sorted array using both iterative loop and recursive divide-and-conquer methods, using safe midpoint calculation low + (high - low) / 2.',
    timeComplexity: 'Best: O(1), Average: O(log n), Worst: O(log n)',
    spaceComplexity: 'Iterative: O(1), Recursive: O(log n) call stack space',
    isStandalone: true,
    relatedLessonId: 'u1-searching-sorting',
    relatedVisualizer: 'array',
    algorithmSteps: [
      'Initialize low = 0, high = n - 1.',
      'While low <= high:',
      '  Calculate mid = low + (high - low) / 2 to avoid integer overflow.',
      '  If arr[mid] == target, return mid.',
      '  If arr[mid] < target, eliminate left half: low = mid + 1.',
      '  If arr[mid] > target, eliminate right half: high = mid - 1.',
      'If low > high, element is not present. Return -1.'
    ],
    edgeCases: [
      'Array of size 1 (target matches or does not match)',
      'Target smaller than smallest element (arr[0])',
      'Target larger than largest element (arr[n-1])',
      'Midpoint integer overflow prevention with large low and high'
    ],
    sampleInput: 'Sorted array: [11, 22, 33, 44, 55, 66, 77], Target: 55',
    expectedOutput: 'Iterative: index 4, Recursive: index 4',
    code: `#include <stdio.h>

int binarySearchIterative(int arr[], int n, int target) {
    int low = 0, high = n - 1;
    while (low <= high) {
        // Safe midpoint to prevent (low + high) integer overflow
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) {
            return mid;
        } else if (arr[mid] < target) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    return -1;
}

int binarySearchRecursive(int arr[], int low, int high, int target) {
    if (low > high) {
        return -1; // Base case: element not found
    }
    int mid = low + (high - low) / 2;
    if (arr[mid] == target) {
        return mid;
    } else if (arr[mid] < target) {
        return binarySearchRecursive(arr, mid + 1, high, target);
    } else {
        return binarySearchRecursive(arr, low, mid - 1, target);
    }
}

int main() {
    int sortedArr[] = {11, 22, 33, 44, 55, 66, 77};
    int n = sizeof(sortedArr) / sizeof(sortedArr[0]);
    int target = 55;

    printf("=== Binary Search Demonstration ===\\n");
    int iterResult = binarySearchIterative(sortedArr, n, target);
    int recResult = binarySearchRecursive(sortedArr, 0, n - 1, target);

    printf("Array: [ 11, 22, 33, 44, 55, 66, 77 ]\\n");
    printf("Target: %d\\n", target);
    printf("Iterative Result Index: %d\\n", iterResult);
    printf("Recursive Result Index: %d\\n", recResult);

    return 0;
}`
  },
  {
    id: 'u1-index-sequential-search',
    unitId: 1,
    topic: 'Searching',
    title: 'Index Sequential Search with Index Block Table',
    category: 'Searching',
    status: 'COMPLETE',
    description: 'Implements Index Sequential Search: creates an auxiliary index table storing the maximum key and starting position of each fixed-size block, quickly locating the relevant block before linear searching.',
    timeComplexity: 'O(B + k) where B is number of index blocks and k is block size',
    spaceComplexity: 'O(B) auxiliary space for index table',
    isStandalone: true,
    relatedLessonId: 'u1-searching-sorting',
    relatedVisualizer: 'array',
    algorithmSteps: [
      'Partition sorted primary array of size N into blocks of size K.',
      'Build index table: each entry contains blockMaxKey and blockStartIndex.',
      'Search index table sequentially: find first block where blockMaxKey >= target.',
      'Search linearly inside that specific block from blockStartIndex to blockStartIndex + K - 1.',
      'If found, return index; if target exceeds block bounds or is absent, return -1.'
    ],
    edgeCases: [
      'Target smaller than first index table key',
      'Target larger than last index table key (immediate reject)',
      'Last block having fewer elements than standard block size'
    ],
    sampleInput: 'Array of 16 sorted items, Block size = 4, Target = 37',
    expectedOutput: 'Index table identifies Block 2 (range 31-40). Found at index 9.',
    code: `#include <stdio.h>
#define BLOCK_SIZE 4

typedef struct {
    int maxKey;
    int startIndex;
} IndexEntry;

int indexSequentialSearch(int arr[], int n, IndexEntry indexTable[], int indexCount, int target) {
    int targetBlock = -1;

    // Search auxiliary index table
    for (int i = 0; i < indexCount; i++) {
        if (target <= indexTable[i].maxKey) {
            targetBlock = i;
            break;
        }
    }

    if (targetBlock == -1) {
        return -1; // Target is greater than the maximum key in array
    }

    int start = indexTable[targetBlock].startIndex;
    int end = start + BLOCK_SIZE;
    if (end > n) end = n;

    // Linear search within the identified block
    for (int i = start; i < end; i++) {
        if (arr[i] == target) {
            return i;
        }
    }
    return -1;
}

int main() {
    int arr[] = {10, 15, 18, 22, 25, 29, 31, 35, 37, 40, 48, 52, 59, 64, 71, 80};
    int n = sizeof(arr) / sizeof(arr[0]);
    int indexCount = (n + BLOCK_SIZE - 1) / BLOCK_SIZE;
    IndexEntry indexTable[indexCount];

    // Build index table
    for (int i = 0; i < indexCount; i++) {
        int start = i * BLOCK_SIZE;
        int end = start + BLOCK_SIZE - 1;
        if (end >= n) end = n - 1;
        indexTable[i].startIndex = start;
        indexTable[i].maxKey = arr[end];
    }

    printf("=== Index Sequential Search Demonstration ===\\n");
    printf("Auxiliary Index Table (Block Size %d):\\n", BLOCK_SIZE);
    for (int i = 0; i < indexCount; i++) {
        printf("Block %d: Start Index = %d, Max Key = %d\\n", i, indexTable[i].startIndex, indexTable[i].maxKey);
    }

    int target = 37;
    int idx = indexSequentialSearch(arr, n, indexTable, indexCount, target);
    if (idx != -1) {
        printf("\\nTarget %d found at primary index %d\\n", target, idx);
    } else {
        printf("\\nTarget %d not found\\n", target);
    }

    return 0;
}`
  },
  {
    id: 'u1-bubble-sort',
    unitId: 1,
    topic: 'Sorting',
    title: 'Bubble Sort with Early Termination Flag',
    category: 'Sorting',
    status: 'COMPLETE',
    description: 'Bubble sort compares adjacent elements and swaps them if out of order. An adaptive swapped flag achieves O(n) best-case time complexity when the input array is already sorted.',
    timeComplexity: 'Best: O(n), Average: O(n^2), Worst: O(n^2)',
    spaceComplexity: 'O(1) auxiliary space (in-place & stable)',
    isStandalone: true,
    relatedLessonId: 'u1-searching-sorting',
    relatedVisualizer: 'sorting',
    algorithmSteps: [
      'Outer loop passes from i = 0 to n - 2.',
      'Set swapped = 0 at start of each pass.',
      'Inner loop compares adjacent elements: j from 0 to n - i - 2.',
      'If arr[j] > arr[j + 1], swap them and set swapped = 1.',
      'If swapped == 0 after inner loop, array is already sorted; break early.'
    ],
    edgeCases: [
      'Already sorted array (terminates after 1 pass in O(n))',
      'Reverse sorted array (worst case with n*(n-1)/2 swaps)',
      'Array with all identical elements (stable, 0 swaps)'
    ],
    sampleInput: 'Array: [64, 34, 25, 12, 22, 11, 90]',
    expectedOutput: 'Sorted array: [11, 12, 22, 25, 34, 64, 90]',
    code: `#include <stdio.h>

void bubbleSort(int arr[], int n) {
    int swapped;
    for (int i = 0; i < n - 1; i++) {
        swapped = 0;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = 1;
            }
        }
        // If no two elements were swapped by inner loop, array is sorted
        if (swapped == 0) {
            printf("Optimized early exit at pass %d\\n", i + 1);
            break;
        }
    }
}

void printArray(int arr[], int n) {
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    printf("\\n");
}

int main() {
    int arr[] = {64, 34, 25, 12, 22, 11, 90};
    int n = sizeof(arr) / sizeof(arr[0]);

    printf("=== Bubble Sort Demonstration ===\\n");
    printf("Original Array: ");
    printArray(arr, n);

    bubbleSort(arr, n);

    printf("Sorted Array:   ");
    printArray(arr, n);
    return 0;
}`
  },
  {
    id: 'u1-selection-sort',
    unitId: 1,
    topic: 'Sorting',
    title: 'Selection Sort',
    category: 'Sorting',
    status: 'COMPLETE',
    description: 'Repeatedly finds the minimum element from the unsorted subarray and swaps it with the first unsorted position. Minimizes total write operations (at most n-1 swaps).',
    timeComplexity: 'Best: O(n^2), Average: O(n^2), Worst: O(n^2)',
    spaceComplexity: 'O(1) auxiliary space (in-place)',
    isStandalone: true,
    relatedLessonId: 'u1-searching-sorting',
    relatedVisualizer: 'sorting',
    algorithmSteps: [
      'Loop i from 0 to n - 2 (boundary of sorted part).',
      'Set minIndex = i.',
      'Loop j from i + 1 to n - 1. If arr[j] < arr[minIndex], update minIndex = j.',
      'If minIndex != i, swap arr[i] with arr[minIndex].'
    ],
    edgeCases: [
      'Array already sorted (still performs O(n^2) comparisons, but 0 swaps)',
      'Array sorted in reverse',
      'Array with duplicate values (note: standard selection sort is unstable)'
    ],
    sampleInput: 'Array: [29, 10, 14, 37, 13]',
    expectedOutput: 'Sorted array: [10, 13, 14, 29, 37]',
    code: `#include <stdio.h>

void selectionSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        if (minIdx != i) {
            int temp = arr[i];
            arr[i] = arr[minIdx];
            arr[minIdx] = temp;
        }
    }
}

void printArray(int arr[], int n) {
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    printf("\\n");
}

int main() {
    int arr[] = {29, 10, 14, 37, 13};
    int n = sizeof(arr) / sizeof(arr[0]);

    printf("=== Selection Sort Demonstration ===\\n");
    printf("Original: ");
    printArray(arr, n);

    selectionSort(arr, n);

    printf("Sorted:   ");
    printArray(arr, n);
    return 0;
}`
  },
  {
    id: 'u1-insertion-sort',
    unitId: 1,
    topic: 'Sorting',
    title: 'Insertion Sort',
    category: 'Sorting',
    status: 'COMPLETE',
    description: 'Builds the sorted array one element at a time by picking each item and shifting greater elements rightwards until its correct sorted position is found.',
    timeComplexity: 'Best: O(n), Average: O(n^2), Worst: O(n^2)',
    spaceComplexity: 'O(1) auxiliary space (in-place & stable)',
    isStandalone: true,
    relatedLessonId: 'u1-searching-sorting',
    relatedVisualizer: 'sorting',
    algorithmSteps: [
      'Loop i from 1 to n - 1.',
      'Store key = arr[i] and set j = i - 1.',
      'While j >= 0 and arr[j] > key:',
      '  arr[j + 1] = arr[j] (shift element right)',
      '  j = j - 1',
      'Place key at arr[j + 1].'
    ],
    edgeCases: [
      'Already sorted array: each key compared once, 0 shifts, O(n) runtime',
      'Reverse sorted array: maximum shifts per element, O(n^2)',
      'Small arrays or nearly sorted data (highly efficient)'
    ],
    sampleInput: 'Array: [12, 11, 13, 5, 6]',
    expectedOutput: 'Sorted array: [5, 6, 11, 12, 13]',
    code: `#include <stdio.h>

void insertionSort(int arr[], int n) {
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        // Move elements of arr[0..i-1] that are greater than key to one position ahead
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}

void printArray(int arr[], int n) {
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    printf("\\n");
}

int main() {
    int arr[] = {12, 11, 13, 5, 6};
    int n = sizeof(arr) / sizeof(arr[0]);

    printf("=== Insertion Sort Demonstration ===\\n");
    printf("Original: ");
    printArray(arr, n);

    insertionSort(arr, n);

    printf("Sorted:   ");
    printArray(arr, n);
    return 0;
}`
  },
  {
    id: 'u1-quick-sort',
    unitId: 1,
    topic: 'Sorting',
    title: 'Quick Sort (Lomuto Partition Scheme)',
    category: 'Sorting',
    status: 'COMPLETE',
    description: 'Divide-and-conquer sorting algorithm. Selects a pivot element, partitions array such that elements smaller than pivot are left and greater are right, then recurses on both partitions.',
    timeComplexity: 'Best: O(n log n), Average: O(n log n), Worst: O(n^2) when pivot is always extreme',
    spaceComplexity: 'O(log n) call stack space',
    isStandalone: true,
    relatedLessonId: 'u1-searching-sorting',
    relatedVisualizer: 'sorting',
    algorithmSteps: [
      'Base condition: if low >= high, return.',
      'Partition: choose arr[high] as pivot.',
      'Maintain pointer i = low - 1. For j from low to high - 1:',
      '  If arr[j] <= pivot, increment i and swap arr[i] with arr[j].',
      'Swap arr[i + 1] with arr[high] (pivot placed in final sorted position).',
      'Recurse: quickSort(arr, low, pivotIndex - 1) and quickSort(arr, pivotIndex + 1, high).'
    ],
    edgeCases: [
      'Already sorted array with end-element pivot produces worst-case O(n^2)',
      'Array with all duplicate elements',
      'Array with 2 elements'
    ],
    sampleInput: 'Array: [10, 80, 30, 90, 40, 50, 70]',
    expectedOutput: 'Sorted array: [10, 30, 40, 50, 70, 80, 90]',
    code: `#include <stdio.h>

void swap(int *a, int *b) {
    int t = *a;
    *a = *b;
    *b = t;
}

int partition(int arr[], int low, int high) {
    int pivot = arr[high]; // Lomuto pivot
    int i = low - 1;

    for (int j = low; j <= high - 1; j++) {
        if (arr[j] <= pivot) {
            i++;
            swap(&arr[i], &arr[j]);
        }
    }
    swap(&arr[i + 1], &arr[high]);
    return (i + 1);
}

void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

void printArray(int arr[], int n) {
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    printf("\\n");
}

int main() {
    int arr[] = {10, 80, 30, 90, 40, 50, 70};
    int n = sizeof(arr) / sizeof(arr[0]);

    printf("=== Quick Sort Demonstration ===\\n");
    printf("Original: ");
    printArray(arr, n);

    quickSort(arr, 0, n - 1);

    printf("Sorted:   ");
    printArray(arr, n);
    return 0;
}`
  },
  {
    id: 'u1-merge-sort',
    unitId: 1,
    topic: 'Sorting',
    title: 'Merge Sort (Divide and Conquer)',
    category: 'Sorting',
    status: 'COMPLETE',
    description: 'Recursively divides array into two halves until singletons remain, then merges sorted subarrays using an auxiliary buffer. Guarantees O(n log n) runtime across all inputs.',
    timeComplexity: 'Best: O(n log n), Average: O(n log n), Worst: O(n log n)',
    spaceComplexity: 'O(n) auxiliary array space (stable)',
    isStandalone: true,
    relatedLessonId: 'u1-searching-sorting',
    relatedVisualizer: 'sorting',
    algorithmSteps: [
      'If low < high:',
      '  mid = low + (high - low) / 2',
      '  mergeSort(arr, low, mid)',
      '  mergeSort(arr, mid + 1, high)',
      '  merge(arr, low, mid, high) combining two sorted halves into temporary buffer.'
    ],
    edgeCases: [
      'Already sorted array (still O(n log n) comparisons)',
      'Odd versus even length subarrays',
      'Stable sorting preservation for identical keys'
    ],
    sampleInput: 'Array: [38, 27, 43, 3, 9, 82, 10]',
    expectedOutput: 'Sorted array: [3, 9, 10, 27, 38, 43, 82]',
    code: `#include <stdio.h>
#include <stdlib.h>

void merge(int arr[], int l, int m, int r) {
    int n1 = m - l + 1;
    int n2 = r - m;

    int L[n1], R[n2];
    for (int i = 0; i < n1; i++) L[i] = arr[l + i];
    for (int j = 0; j < n2; j++) R[j] = arr[m + 1 + j];

    int i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k++] = L[i++];
        } else {
            arr[k++] = R[j++];
        }
    }

    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];
}

void mergeSort(int arr[], int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}

void printArray(int arr[], int n) {
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    printf("\\n");
}

int main() {
    int arr[] = {38, 27, 43, 3, 9, 82, 10};
    int n = sizeof(arr) / sizeof(arr[0]);

    printf("=== Merge Sort Demonstration ===\\n");
    printf("Original: ");
    printArray(arr, n);

    mergeSort(arr, 0, n - 1);

    printf("Sorted:   ");
    printArray(arr, n);
    return 0;
}`
  },
  {
    id: 'u1-radix-sort',
    unitId: 1,
    topic: 'Sorting',
    title: 'Radix Sort (LSD Base-10 with Counting Sort)',
    category: 'Sorting',
    status: 'COMPLETE',
    description: 'Non-comparative sorting algorithm. Processes digits from Least Significant Digit (LSD) to Most Significant Digit (MSD) using a stable counting sort subroutine.',
    timeComplexity: 'O(d * (n + b)) where d = max digits, b = base (10)',
    spaceComplexity: 'O(n + b) auxiliary space for output and count buffers',
    isStandalone: true,
    relatedLessonId: 'u1-searching-sorting',
    relatedVisualizer: 'sorting',
    algorithmSteps: [
      'Find maximum element in array to know total number of digits d.',
      'For exp = 1, 10, 100... while max / exp > 0:',
      '  Call countSort(arr, n, exp) using (arr[i] / exp) % 10 as bucket key.',
      '  Build prefix frequency array to preserve stable order.',
      '  Copy stable sorted output array back into arr.'
    ],
    edgeCases: [
      'Numbers with varying numbers of digits (e.g. 5, 802, 17)',
      'All numbers have identical number of digits',
      'Single-element array'
    ],
    sampleInput: 'Array: [170, 45, 75, 90, 802, 24, 2, 66]',
    expectedOutput: 'Sorted array: [2, 24, 45, 66, 75, 90, 170, 802]',
    code: `#include <stdio.h>

int getMax(int arr[], int n) {
    int max = arr[0];
    for (int i = 1; i < n; i++) {
        if (arr[i] > max) max = arr[i];
    }
    return max;
}

void countSort(int arr[], int n, int exp) {
    int output[n];
    int count[10] = {0};

    // Store count of occurrences in count[]
    for (int i = 0; i < n; i++) {
        count[(arr[i] / exp) % 10]++;
    }

    // Change count[i] so that count[i] now contains actual position in output[]
    for (int i = 1; i < 10; i++) {
        count[i] += count[i - 1];
    }

    // Build output array in reverse to ensure stability
    for (int i = n - 1; i >= 0; i--) {
        int digit = (arr[i] / exp) % 10;
        output[count[digit] - 1] = arr[i];
        count[digit]--;
    }

    // Copy output array back to arr[]
    for (int i = 0; i < n; i++) {
        arr[i] = output[i];
    }
}

void radixSort(int arr[], int n) {
    int m = getMax(arr, n);
    // Apply counting sort for each digit position: 1s, 10s, 100s, ...
    for (int exp = 1; m / exp > 0; exp *= 10) {
        countSort(arr, n, exp);
    }
}

void printArray(int arr[], int n) {
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    printf("\\n");
}

int main() {
    int arr[] = {170, 45, 75, 90, 802, 24, 2, 66};
    int n = sizeof(arr) / sizeof(arr[0]);

    printf("=== Radix Sort Demonstration (LSD Base-10) ===\\n");
    printf("Original: ");
    printArray(arr, n);

    radixSort(arr, n);

    printf("Sorted:   ");
    printArray(arr, n);
    return 0;
}`
  }
];
