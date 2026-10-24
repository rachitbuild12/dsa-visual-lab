import { Lesson } from '../types';

export const ALL_LESSONS: Lesson[] = [
  // ==========================================
  // UNIT I: FOUNDATIONS & ARRAYS
  // ==========================================
  {
    id: 'u1-time-complexity',
    unitId: 1,
    title: 'Time & Space Complexity (Asymptotic Notations)',
    subtitle: 'Big O, Big Theta (Θ), and Big Omega (Ω) Explained for Exams',
    category: 'core',
    readTimeMin: 7,
    visualizerType: 'sorting',
    whatIsIt: {
      english: 'Time complexity is the mathematical expression showing how an algorithm\'s runtime grows as the input size (n) increases. It does not measure seconds, but the rate of growth of basic operations. Space complexity is the extra memory required by the algorithm in addition to input storage.',
      hinglish: 'Time complexity yeh batata hai ki jab humara input size (n) bada hota hai, toh program ka execution steps kis rate se badhta hai. Hum seconds nahi naapte, operations ki growth naapte hain.'
    },
    beginnerGlossary: [
      {
        term: 'Asymptotic Analysis',
        explanation: 'Evaluating algorithm efficiency when input size n approaches infinity (very large inputs).',
        hinglishExplanation: 'Bahut bade input size par algorithm kaisa perform karega uska mathematical calculation.'
      },
      {
        term: 'Order of Growth',
        explanation: 'How quickly execution time increases: O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ).',
        hinglishExplanation: 'Kaunsa algorithm kitna fast ya slow grow karta hai.'
      }
    ],
    analogy: {
      title: 'Finding a Friend in a Crowd',
      english: 'If you have their exact phone number and call directly, that takes O(1) constant time regardless of crowd size. If you walk and check each person one by one, that takes O(n) linear time. If you must introduce every person to every other person, that is O(n²) quadratic time.',
      hinglish: 'Agar seedhe phone dial karke dost ko bula liya toh O(1) constant time hai chahe bheed 10 ki ho ya 10,000 ki. Par agar har insaan ka chehra ek-ek karke check kiya toh O(n) linear time lagega.'
    },
    algorithm: {
      title: 'Determining Time Complexity of a Loop',
      steps: [
        'Identify basic operations (assignments, comparisons, arithmetic) executing inside the innermost loops.',
        'Count how many times the loop condition evaluates as a function of n.',
        'For nested loops, multiply the iterations of outer and inner loops.',
        'Drop lower-order terms (e.g., 3n² + 5n + 10 becomes O(n²)).',
        'Drop constant multiplicative coefficients (e.g., 4n becomes O(n)).'
      ]
    },
    cCode: {
      title: 'Complexity Demo in C (Constant, Linear, Quadratic)',
      code: `#include <stdio.h>

// O(1) - Constant Time: Direct index access
int getFirstElement(int arr[], int n) {
    if (n > 0) return arr[0];
    return -1;
}

// O(n) - Linear Time: Single loop through n elements
int findSum(int arr[], int n) {
    int sum = 0;
    for (int i = 0; i < n; i++) {
        sum += arr[i];
    }
    return sum;
}

// O(n^2) - Quadratic Time: Nested loops comparing pairs
void printAllPairs(int arr[], int n) {
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            printf("(%d, %d) ", arr[i], arr[j]);
        }
        printf("\\n");
    }
}

int main() {
    int data[] = {10, 20, 30};
    int n = 3;
    printf("First: %d\\n", getFirstElement(data, n));
    printf("Sum: %d\\n", findSum(data, n));
    printf("Pairs:\\n");
    printAllPairs(data, n);
    return 0;
}`,
      isCompilable: true,
      sampleInput: 'No input required',
      expectedOutput: 'First: 10\nSum: 60\nPairs:\n(10, 10) (10, 20) (10, 30) \n(20, 10) (20, 20) (20, 30) \n(30, 10) (30, 20) (30, 30)'
    },
    lineExplanations: [
      {
        line: 5,
        code: 'if (n > 0) return arr[0];',
        explanation: 'Only a single array access happens. Takes O(1) time regardless of whether n is 5 or 5 million.'
      },
      {
        line: 12,
        code: 'for (int i = 0; i < n; i++)',
        explanation: 'Loop executes exactly n times. Work inside loop is constant, giving O(n) linear complexity.'
      },
      {
        line: 20,
        code: 'for (int i = 0; i < n; i++) { for (int j = 0; j < n; j++) { ... } }',
        explanation: 'Outer loop runs n times, and for every outer step, the inner loop runs n times. Total steps = n * n = O(n²).'
      }
    ],
    complexity: {
      timeBest: 'O(1) - Constant time',
      timeAverage: 'O(n) - Linear time',
      timeWorst: 'O(n²) - Quadratic time',
      space: 'O(1) - Auxiliary space',
      reasoning: 'Memory used is only a few scalar integer variables (sum, i, j). No extra dynamic memory is allocated.',
      hinglishReasoning: 'Program sirf kuch simple variables (sum, i, j) use kar raha hai, koi extra array create nahi kiya, isliye space O(1) hai.'
    },
    examAnswers: [
      {
        marks: 2,
        question: 'Define Big-O Notation and Big-Omega Notation.',
        answer: 'Big-O notation represents the upper bound (worst-case) of an algorithm\'s running time, formally defined as: f(n) <= c * g(n) for all n >= n0 and c > 0. Big-Omega (Ω) represents the lower bound (best-case) running time, formally: f(n) >= c * g(n) for all n >= n0 and c > 0.',
        keyPoints: [
          'Big-O = Upper bound (worst case guarantee)',
          'Big-Omega = Lower bound (best case performance)',
          'Big-Theta = Tight bound (both upper and lower bound)'
        ]
      },
      {
        marks: 5,
        question: 'Explain Time-Space Trade-off with a suitable example.',
        answer: 'The Time-Space Trade-off is a foundational principle in computer science stating that an algorithm can often be made faster by using more memory, or memory usage can be minimized at the expense of slower execution.\n\nExample 1: Look-up Tables / Hashing vs Linear Search.\nLinear search uses O(1) auxiliary space but takes O(n) time. A Hash table achieves O(1) average lookup time by consuming extra space to store buckets.\n\nExample 2: Fibonacci Calculation.\nRecursive Fibonacci takes O(2^n) exponential time with O(n) stack space. By using dynamic programming with an array of size n (O(n) space), runtime drops drastically to O(n) linear time.',
        keyPoints: [
          'Definition: Balancing memory consumption vs execution time',
          'Recursive vs DP Fibonacci example (O(2^n) vs O(n))',
          'Hashing lookup vs Sequential search example',
          'In university exams, always draw a comparison table showing Time vs Space'
        ]
      }
    ],
    commonMistakes: [
      {
        mistake: 'Confusing seconds on a stopwatch with time complexity.',
        whyItHappens: 'Students run code on their laptops and think runtime in milliseconds is Big-O.',
        howToFix: 'Big-O counts operations relative to n, completely independent of CPU clock speed, hardware, or compiler optimizations.'
      },
      {
        mistake: 'Assuming worst-case is always O(n²).',
        whyItHappens: 'Over-generalizing bubble sort and nested loops.',
        howToFix: 'Merge sort worst-case is O(n log n); binary search worst-case is O(log n); hash table worst-case is O(n).'
      }
    ],
    quickQuestions: [
      {
        id: 'q-comp-1',
        type: 'mcq',
        question: 'What is the time complexity of finding an element by index in an array: arr[k]?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
        correctAnswer: 0,
        explanation: 'Array elements reside in contiguous memory; address is calculated directly via BaseAddress + k * sizeof(type) in O(1) time.',
        difficulty: 'Easy',
        unit: 1,
        topicId: 'complexity'
      },
      {
        id: 'q-comp-2',
        type: 'output',
        question: 'If a loop runs while (i < n) with i = i * 2 starting from i = 1, what is the Big-O time complexity?',
        options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
        correctAnswer: 1,
        explanation: 'Since i doubles at each iteration (1, 2, 4, 8, ... 2^k), 2^k = n implies k = log₂(n) iterations.',
        difficulty: 'Medium',
        unit: 1,
        topicId: 'complexity'
      }
    ]
  },

  {
    id: 'u1-arrays-address-calculation',
    unitId: 1,
    title: '1D, 2D Arrays & Address Calculation Formulas',
    subtitle: 'Row-Major Order, Column-Major Order & Index Formulas',
    category: 'core',
    readTimeMin: 8,
    visualizerType: 'array',
    whatIsIt: {
      english: 'An array is a linear collection of homogeneous elements stored in contiguous memory locations. In 2D arrays, memory is 1-dimensional hardware, so 2D matrices must be flattened in either Row-Major Order (row after row) or Column-Major Order (column after column). Address formulas calculate the exact physical memory byte for any element A[i][j].',
      hinglish: 'Array ek continuous memory block hota hai jisme same type ka data store hota hai. RAM 1D hoti hai, isliye 2D matrix ko ya toh row-by-row (Row Major) ya column-by-column (Column Major) store kiya jata hai.'
    },
    beginnerGlossary: [
      {
        term: 'Base Address (BA)',
        explanation: 'The memory address of the first element in the array, usually A[0] or A[0][0].',
        hinglishExplanation: 'Pehle element ka RAM address jahan se array start hoti hai.'
      },
      {
        term: 'Element Size (W)',
        explanation: 'Number of bytes occupied by a single element (e.g., int is typically 4 bytes in modern C, or 2 bytes in older 16-bit systems).',
        hinglishExplanation: 'Ek single data item kitne bytes leta hai memory mein.'
      }
    ],
    analogy: {
      title: 'Apartment Flats on Floors',
      english: 'Imagine an apartment building with rows (floors) and columns (flat numbers). If the mail carrier visits Floor 1 (Flats 1, 2, 3), then Floor 2 (Flats 1, 2, 3), that is Row-Major Order (used by C/C++). If the carrier visits Flat 1 on all floors first, then Flat 2 on all floors, that is Column-Major Order (used by Fortran).',
      hinglish: 'Maan lo ek building mein floors rows hain aur flats columns hain. Agar pehle floor 1 ke saare flats dekho phir floor 2 ke, toh yeh Row Major hai (C language yahi karti hai).'
    },
    algorithm: {
      title: 'Address Calculation in 2D Array A[M][N] (0-indexed)',
      steps: [
        'Identify: Base Address (BA), Element size (W), Number of rows (M), Number of columns (N).',
        'Row-Major Formula for A[i][j]: Address = BA + W * (i * N + j)',
        'Explanation: To reach row i, we skip i complete rows, each having N elements, then move j steps in current row.',
        'Column-Major Formula for A[i][j]: Address = BA + W * (j * M + i)',
        'Explanation: To reach column j, we skip j complete columns, each having M elements, then move i steps in current column.'
      ]
    },
    cCode: {
      title: 'Demonstrating 2D Array Contiguous Memory in C',
      code: `#include <stdio.h>

int main() {
    // 2D Array: 3 rows, 4 columns
    int A[3][4] = {
        {10, 11, 12, 13},
        {20, 21, 22, 23},
        {30, 31, 32, 33}
    };
    
    printf("Row-Major Memory Addresses in C:\\n");
    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 4; j++) {
            printf("&A[%d][%d] = %p (val: %d)\\n", 
                   i, j, (void*)&A[i][j], A[i][j]);
        }
    }
    
    // Address formula verification using pointer arithmetic
    int *base = &A[0][0];
    int target_i = 2, target_j = 1; // A[2][1] should be 31
    int N = 4; // total columns
    int *computedPtr = base + (target_i * N + target_j);
    
    printf("\\nTarget A[%d][%d] value via formula: %d\\n", 
           target_i, target_j, *computedPtr);
    return 0;
}`,
      isCompilable: true,
      sampleInput: 'None',
      expectedOutput: 'Row-Major Memory Addresses in C:\n...\nTarget A[2][1] value via formula: 31'
    },
    lineExplanations: [
      {
        line: 20,
        code: 'int *computedPtr = base + (target_i * N + target_j);',
        explanation: 'Applies the row-major formula: index = i * columns + j. C pointer arithmetic automatically scales by sizeof(int).'
      }
    ],
    complexity: {
      timeBest: 'O(1)',
      timeAverage: 'O(1)',
      timeWorst: 'O(1)',
      space: 'O(1)',
      reasoning: 'Address calculation requires simple integer multiplication and addition, executing in constant CPU cycles.',
      hinglishReasoning: 'Address calculate karne ke liye sirf ek formula lagta hai, isliye time O(1) lagta hai.'
    },
    examAnswers: [
      {
        marks: 5,
        question: 'An array A[1..10, 1..15] is stored in memory in Row-Major Order. Base address is 1000 and each element requires 2 bytes. Calculate the address of A[7][12].',
        answer: 'Given:\nLower Bound Row (Lr) = 1, Upper Bound Row (Ur) = 10\nLower Bound Col (Lc) = 1, Upper Bound Col (Uc) = 15\nBase Address (BA) = 1000\nElement size (W) = 2 bytes\nNumber of columns (N) = Uc - Lc + 1 = 15 - 1 + 1 = 15\nTarget index: i = 7, j = 12\n\nRow-Major Formula for 1-based indexing:\nAddress(A[i][j]) = BA + W * [(i - Lr) * N + (j - Lc)]\n\nCalculation:\nAddress = 1000 + 2 * [(7 - 1) * 15 + (12 - 1)]\nAddress = 1000 + 2 * [6 * 15 + 11]\nAddress = 1000 + 2 * [90 + 11]\nAddress = 1000 + 2 * [101]\nAddress = 1000 + 202 = 1202\n\nFinal Answer: 1202',
        keyPoints: [
          'State given parameters (BA, W, Lr, Ur, Lc, Uc, N)',
          'Formula: BA + W * [(i - Lr) * N + (j - Lc)]',
          'Step-by-step substitution to secure full 5 marks'
        ]
      }
    ],
    commonMistakes: [
      {
        mistake: 'Using Row count (M) instead of Column count (N) in Row-Major order.',
        whyItHappens: 'Rote memorization confusion between M and N.',
        howToFix: 'Remember: In Row-Major, skipping a row means skipping all columns of that row. Therefore, multiply by N (columns)!'
      }
    ],
    quickQuestions: [
      {
        id: 'q-arr-1',
        type: 'mcq',
        question: 'In C language, 2D arrays are stored in which order?',
        options: ['Row-Major Order', 'Column-Major Order', 'Diagonal Order', 'Zigzag Order'],
        correctAnswer: 0,
        explanation: 'C and C++ store multi-dimensional arrays in Row-Major Order where rows are laid out consecutively in memory.',
        difficulty: 'Easy',
        unit: 1,
        topicId: 'arrays'
      }
    ]
  },

  {
    id: 'u1-binary-search',
    unitId: 1,
    title: 'Searching Algorithms: Linear vs Binary Search',
    subtitle: 'Divide-and-Conquer Search with O(log n) Efficiency',
    category: 'core',
    readTimeMin: 8,
    visualizerType: 'array',
    whatIsIt: {
      english: 'Linear search scans elements sequentially from index 0 to n-1 in O(n) time. Binary search is an optimal divide-and-conquer algorithm that works exclusively on SORTED arrays by repeatedly dividing the search interval in half, achieving O(log n) performance.',
      hinglish: 'Linear search ek-ek karke shuru se aakhri tak dhundhta hai. Binary search sirf SORTED array par chalta hai aur har step mein array ko aadha (half) eliminate kar deta hai, jisse yeh O(log n) super-fast hota hai.'
    },
    beginnerGlossary: [
      {
        term: 'Divide and Conquer',
        explanation: 'Breaking a problem into smaller sub-problems, solving the sub-problem, and combining the results.',
        hinglishExplanation: 'Badi problem ko aadhi-aadhi choti problems mein baant kar solve karna.'
      },
      {
        term: 'Prerequisite of Binary Search',
        explanation: 'The array MUST be sorted beforehand (in ascending or descending order).',
        hinglishExplanation: 'Binary search lagane ke liye array ka pehle se SORTED hona zaroori hai.'
      }
    ],
    analogy: {
      title: 'Searching a Name in a Telephone Directory',
      english: 'If you want to find "Rohit" in a dictionary, you do not start from page 1 reading every name. You flip to the middle. If you land on "M", you know "R" must be in the right half, so you throw away the entire left half! Repeating this finds the name in ~10 flips among 1,000 pages.',
      hinglish: 'Dictionary mein koi shabd dhundhne ke liye hum page 1 se start nahi karte. Beech ka page kholte hain, agar wahan "M" mila toh poora left half ignore kar dete hain kyunki "R" right half mein hi milega.'
    },
    algorithm: {
      title: 'Binary Search Algorithm (Iterative)',
      steps: [
        'Set low = 0 and high = n - 1.',
        'While low <= high:',
        '  Calculate mid = low + (high - low) / 2 (prevents integer overflow).',
        '  If arr[mid] == target, return mid (element found).',
        '  If arr[mid] < target, element is in right half; set low = mid + 1.',
        '  If arr[mid] > target, element is in left half; set high = mid - 1.',
        'If loop terminates without returning, return -1 (element not present).'
      ]
    },
    cCode: {
      title: 'Compilable Binary Search in C',
      code: `#include <stdio.h>

int binarySearch(int arr[], int n, int target) {
    int low = 0;
    int high = n - 1;
    
    while (low <= high) {
        // Safe mid calculation to prevent (low + high) overflow
        int mid = low + (high - low) / 2;
        
        if (arr[mid] == target) {
            return mid; // Found at index mid
        } else if (arr[mid] < target) {
            low = mid + 1; // Search right half
        } else {
            high = mid - 1; // Search left half
        }
    }
    return -1; // Not found
}

int main() {
    int arr[] = {3, 9, 14, 19, 25, 31, 42, 55, 68, 77};
    int n = sizeof(arr) / sizeof(arr[0]);
    int target = 31;
    
    int result = binarySearch(arr, n, target);
    if (result != -1) {
        printf("Element %d found at index %d\\n", target, result);
    } else {
        printf("Element %d not found\\n", target);
    }
    return 0;
}`,
      isCompilable: true,
      sampleInput: 'Target = 31',
      expectedOutput: 'Element 31 found at index 5'
    },
    lineExplanations: [
      {
        line: 9,
        code: 'int mid = low + (high - low) / 2;',
        explanation: 'Calculates the center index safely. Writing (low + high) / 2 can overflow if low + high exceeds INT_MAX (2,147,483,647).'
      },
      {
        line: 13,
        code: 'low = mid + 1;',
        explanation: 'Since target > arr[mid], the target cannot be at mid or to its left. We adjust low past mid.'
      }
    ],
    complexity: {
      timeBest: 'O(1) - When element is at initial middle',
      timeAverage: 'O(log n)',
      timeWorst: 'O(log n) - When element is at end or absent',
      space: 'O(1) - Iterative uses constant memory',
      reasoning: 'At each iteration, search space is halved: n, n/2, n/4, ..., 1. Number of steps k satisfies n / 2^k = 1, so k = log₂(n).',
      hinglishReasoning: 'Har step mein array ki length aadhi hoti jaati hai. 1024 elements ko search karne mein max 10 steps lagte hain.'
    },
    examAnswers: [
      {
        marks: 5,
        question: 'Differentiate between Linear Search and Binary Search.',
        answer: '1. Condition: Linear search works on both sorted and unsorted arrays. Binary search STRICTLY requires a sorted array.\n2. Time Complexity: Linear search is O(n) worst-case. Binary search is O(log n) worst-case.\n3. Technique: Linear search uses sequential traversal. Binary search uses Divide and Conquer.\n4. Access Type: Linear search works on sequential access data structures (like linked lists). Binary search requires direct/random access (like arrays).\n5. Number of comparisons: For 1,000,000 elements, Linear search takes up to 1,000,000 checks, while Binary search takes at most 20 checks.',
        keyPoints: [
          'Sorted vs Unsorted requirement',
          'O(n) vs O(log n) complexity',
          'Sequential vs Divide & Conquer method',
          'Array vs Linked List compatibility'
        ]
      }
    ],
    commonMistakes: [
      {
        mistake: 'Applying binary search on an unsorted array.',
        whyItHappens: 'Forgetting that halving decisions assume sorted order.',
        howToFix: 'Always sort the array first or use linear search if unsorted.'
      },
      {
        mistake: 'Writing while (low < high) instead of while (low <= high).',
        whyItHappens: 'Missing the single-element case where low == high.',
        howToFix: 'Use low <= high so that when the interval shrinks to a single element, that element is still checked.'
      }
    ],
    quickQuestions: [
      {
        id: 'q-bs-1',
        type: 'mcq',
        question: 'What is the maximum number of comparisons to search in a sorted array of 128 elements using Binary Search?',
        options: ['128', '64', '7', '8'],
        correctAnswer: 2,
        explanation: 'log₂(128) = 7. Thus, at most 7 comparisons are needed in the worst case.',
        difficulty: 'Easy',
        unit: 1,
        topicId: 'searching'
      }
    ]
  },

  {
    id: 'u1-sorting-algorithms',
    unitId: 1,
    title: 'All Sorting Algorithms: Bubble, Selection, Insertion, Quick, Merge, Radix',
    subtitle: 'Step-by-Step Mechanisms, Stability & Complexity Comparisons',
    category: 'core',
    readTimeMin: 12,
    visualizerType: 'sorting',
    whatIsIt: {
      english: 'Sorting is the process of arranging elements of an array in ascending or descending order. Algorithms are categorized by technique (Comparison vs Non-comparison), stability (preserving relative order of equal keys), and in-place memory characteristics.',
      hinglish: 'Sorting ka matlab data ko chote se bade (ascending) ya bade se chote (descending) kram mein lagana hai. College exams mein Bubble, Selection, Insertion, Quick, Merge aur Radix sort par 10-mark ke questions aate hain.'
    },
    beginnerGlossary: [
      {
        term: 'Stable Sort',
        explanation: 'A sorting algorithm that preserves the original relative order of duplicate elements.',
        hinglishExplanation: 'Agar do elements ki value same hai, toh sort hone ke baad bhi unka pehle-baad ka order nahi badalta.'
      },
      {
        term: 'In-Place Sort',
        explanation: 'An algorithm that sorts the array using O(1) or O(log n) auxiliary memory without creating a secondary copy of the array.',
        hinglishExplanation: 'Bina koi naya bada array banaye, usi array ke andar elements swap karke sort karna.'
      }
    ],
    analogy: {
      title: 'Sorting Playing Cards in Hand',
      english: 'Insertion sort is exactly how you sort playing cards in your hand: you take one card at a time and slide it backward into its correct sorted spot among the cards you already arranged.',
      hinglish: 'Taash ke patte sort karte waqt hum har naya patta utha kar pehle se sorted patto ke beech sahi jagah daalte hain — yahi Insertion Sort hai.'
    },
    algorithm: {
      title: 'Quick Sort (Divide and Conquer with Partitioning)',
      steps: [
        'Choose a pivot element from the array (e.g., last element arr[high]).',
        'Partitioning: Rearrange array so all elements smaller than pivot are on its left, and all greater elements are on its right.',
        'Place pivot in its final sorted position at index p.',
        'Recursively apply Quick Sort to sub-array left of pivot: quickSort(arr, low, p - 1).',
        'Recursively apply Quick Sort to sub-array right of pivot: quickSort(arr, p + 1, high).'
      ]
    },
    cCode: {
      title: 'Bubble Sort with Optimization Flag in C',
      code: `#include <stdio.h>

void bubbleSort(int arr[], int n) {
    int swapped;
    for (int i = 0; i < n - 1; i++) {
        swapped = 0; // Optimization: early stop if already sorted
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // Swap arr[j] and arr[j+1]
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = 1;
            }
        }
        // If no two elements were swapped in this pass, array is sorted!
        if (swapped == 0) break;
    }
}

int main() {
    int data[] = {64, 34, 25, 12, 22, 11, 90};
    int n = sizeof(data) / sizeof(data[0]);
    bubbleSort(data, n);
    printf("Sorted array: ");
    for (int i = 0; i < n; i++) printf("%d ", data[i]);
    printf("\\n");
    return 0;
}`,
      isCompilable: true,
      sampleInput: '64 34 25 12 22 11 90',
      expectedOutput: 'Sorted array: 11 12 22 25 34 64 90'
    },
    lineExplanations: [
      {
        line: 6,
        code: 'swapped = 0;',
        explanation: 'Tracking whether any swaps occur allows O(n) best-case detection if the input array is already sorted.'
      },
      {
        line: 7,
        code: 'for (int j = 0; j < n - i - 1; j++)',
        explanation: 'After pass i, the largest i elements have already bubbled to the end, so we do not re-check them.'
      }
    ],
    complexity: {
      timeBest: 'O(n) - Bubble/Insertion (optimized) on sorted array',
      timeAverage: 'O(n log n) - Quick/Merge Sort',
      timeWorst: 'O(n²) - Bubble/Selection/Quick (worst pivot)',
      space: 'O(1) - Bubble/Selection/Insertion; O(n) for Merge Sort',
      reasoning: 'Merge Sort requires an auxiliary array of size n to merge sorted subarrays. Quick Sort requires O(log n) recursion call stack space.',
      hinglishReasoning: 'Merge sort ko merge karne ke liye alag se n size ka array chahiye hota hai isliye space O(n) hai. Quick sort in-place hai.'
    },
    examAnswers: [
      {
        marks: 5,
        question: 'Compare Bubble Sort, Quick Sort, and Merge Sort in tabular form.',
        answer: 'Aspect | Bubble Sort | Quick Sort | Merge Sort\n---|---|---|---\nStrategy | Comparison / Swapping | Divide & Conquer (Partition) | Divide & Conquer (Merge)\nBest Time | O(n) (optimized) | O(n log n) | O(n log n)\nAverage Time | O(n²) | O(n log n) | O(n log n)\nWorst Time | O(n²) | O(n²) (skewed pivot) | O(n log n) (guaranteed!)\nAuxiliary Space | O(1) (in-place) | O(log n) stack | O(n) extra array\nStability | Stable | Unstable | Stable',
        keyPoints: [
          'Tabular format is highly rewarded by university examiners',
          'Mention Best, Average, Worst time for each',
          'Highlight Merge sort guaranteed O(n log n) but O(n) space',
          'Specify stability of each algorithm'
        ]
      }
    ],
    commonMistakes: [
      {
        mistake: 'Assuming Quick Sort is always O(n log n).',
        whyItHappens: 'Forgetting the degenerate case when array is already sorted and first/last element is picked as pivot.',
        howToFix: 'Worst case of Quick Sort is O(n²) when partition is unbalanced (0 elements on one side, n-1 on the other).'
      }
    ],
    quickQuestions: [
      {
        id: 'q-sort-1',
        type: 'mcq',
        question: 'Which sorting algorithm has a guaranteed worst-case time complexity of O(n log n)?',
        options: ['Bubble Sort', 'Quick Sort', 'Merge Sort', 'Selection Sort'],
        correctAnswer: 2,
        explanation: 'Merge sort always splits the list in exact halves and merges in linear time, guaranteeing O(n log n) even in worst case.',
        difficulty: 'Easy',
        unit: 1,
        topicId: 'sorting'
      }
    ]
  },

  // ==========================================
  // UNIT II: LINKED LISTS & HASHING
  // ==========================================
  {
    id: 'u2-singly-linked-list',
    unitId: 2,
    title: 'Singly Linked List: Concept, Pointers & Operations',
    subtitle: 'Node Structure, malloc, Traversal, Insertion & Deletion in C',
    category: 'core',
    readTimeMin: 10,
    visualizerType: 'linked-list',
    whatIsIt: {
      english: 'A Singly Linked List is a dynamic, linear data structure composed of nodes allocated in heap memory. Each node contains two parts: data (value) and a next pointer containing the memory address of the subsequent node. The last node points to NULL.',
      hinglish: 'Singly Linked List dynamic nodes ka chain hota hai jahan har node mein do cheezein hoti hain: ek data aur dusra agle node ka memory address (pointer). Aakhri node ka pointer NULL hota hai.'
    },
    beginnerGlossary: [
      {
        term: 'struct Node',
        explanation: 'A user-defined C composite data type containing data fields and a self-referential pointer struct Node* next.',
        hinglishExplanation: 'C language ka struct jo data aur agle node ke address dono ko ek saath rakhta hai.'
      },
      {
        term: 'malloc()',
        explanation: 'Memory Allocation function from <stdlib.h> that requests raw bytes from Heap memory and returns a pointer.',
        hinglishExplanation: 'RAM ke heap area se naya node banane ke liye memory mangna.'
      },
      {
        term: 'head pointer',
        explanation: 'A pointer variable that stores the address of the very first node. If head == NULL, list is empty.',
        hinglishExplanation: 'Chain ka pehla link. Agar head NULL hai toh list khali hai.'
      }
    ],
    analogy: {
      title: 'A Treasure Hunt Clue Chain',
      english: 'In a treasure hunt, Clue 1 gives you a secret code and a slip saying "Go to Room 204". Room 204 has Clue 2 with its code and a note saying "Go to Garden Bench 3". You cannot skip directly to Clue 5 without following the chain of notes one by one! This is why linked lists do not have O(1) random access like arrays.',
      hinglish: 'Treasure hunt jaisa: har parchi par clue hota hai aur agle room ka address. Aap bina beech ke rooms dekhe aakhri parchi par nahi pahunch sakte. Isliye linked list mein index access O(n) hota hai.'
    },
    algorithm: {
      title: 'Insertion at Beginning of Singly Linked List',
      steps: [
        'Allocate memory for new node: newNode = (struct Node*)malloc(sizeof(struct Node)).',
        'Check if allocation succeeded: if (newNode == NULL) return (Overflow / Memory Full).',
        'Set newNode->data = val.',
        'CRITICAL ORDER: newNode->next = head; (Point new node to current first node).',
        'Update head: head = newNode; (Make new node the new head of the list).'
      ]
    },
    cCode: {
      title: 'Complete Singly Linked List with Insertion & Display in C',
      code: `#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node* next;
};

// Insert at beginning: O(1)
struct Node* insertAtBeginning(struct Node* head, int value) {
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    if (newNode == NULL) {
        printf("Heap Overflow! Unable to allocate memory.\\n");
        return head;
    }
    newNode->data = value;
    newNode->next = head; // Point new node to current head
    head = newNode;       // Move head to new node
    return head;
}

// Traverse and print list: O(n)
void displayList(struct Node* head) {
    struct Node* current = head;
    printf("HEAD -> ");
    while (current != NULL) {
        printf("[%d | next] -> ", current->data);
        current = current->next;
    }
    printf("NULL\\n");
}

int main() {
    struct Node* head = NULL; // Initially empty list
    
    head = insertAtBeginning(head, 30);
    head = insertAtBeginning(head, 20);
    head = insertAtBeginning(head, 10);
    
    displayList(head);
    return 0;
}`,
      isCompilable: true,
      sampleInput: 'Values: 30, then 20, then 10',
      expectedOutput: 'HEAD -> [10 | next] -> [20 | next] -> [30 | next] -> NULL'
    },
    lineExplanations: [
      {
        line: 16,
        code: 'newNode->next = head;',
        explanation: 'CRITICAL: We must link the new node to the old head FIRST before updating head. If we updated head first, we would lose reference to the entire rest of the list!'
      },
      {
        line: 17,
        code: 'head = newNode;',
        explanation: 'Now that the chain is safely linked, head pointer is updated to point to our newly created node.'
      }
    ],
    complexity: {
      timeBest: 'O(1) - Insert/Delete at beginning',
      timeAverage: 'O(n) - Insert/Delete at position or search',
      timeWorst: 'O(n) - Insert/Delete at end (without tail pointer)',
      space: 'O(n) - Stores n nodes + pointer overhead',
      reasoning: 'Each node stores an extra pointer (4 or 8 bytes) in addition to data. No contiguous array reallocation required.',
      hinglishReasoning: 'Har node ke paas data ke sath pointer ka extra memory lagta hai. Shuru mein add karna O(1) hai, end tak traverse karna O(n) hai.'
    },
    examAnswers: [
      {
        marks: 5,
        question: 'Differentiate between Array and Linked List with memory diagrams.',
        answer: 'Feature | Array | Linked List\n---|---|---\nMemory Allocation | Static or contiguous dynamic block | Dynamic heap nodes, non-contiguous\nSize | Fixed at creation (in static array) | Dynamic, grows and shrinks at runtime\nInsertion/Deletion | Costly: O(n) due to element shifting | Fast: O(1) if pointer is known (no shifting!)\nRandom Access | Supported: O(1) via index formula | Not supported: O(n) sequential traversal\nMemory Overhead | Zero extra pointer overhead | Each node consumes pointer storage (sizeof pointer)\nCache Locality | Excellent (contiguous memory prefetching) | Poor (scattered across heap)',
        keyPoints: [
          'Contiguous vs Non-contiguous memory allocation',
          'Shifting requirement in array vs pointer updates in linked list',
          'O(1) random index access vs O(n) sequential traversal',
          'Draw node with [Data | Next] box pointing to next node'
        ]
      }
    ],
    commonMistakes: [
      {
        mistake: 'Updating head before setting newNode->next = head.',
        whyItHappens: 'Beginners intuitively think "make new node head first".',
        howToFix: 'If you do head = newNode first, the old head address is overwritten and the entire existing list is lost in memory (memory leak).'
      },
      {
        mistake: 'Forgetting to free() deleted nodes.',
        whyItHappens: 'Just unlinking the pointer without freeing.',
        howToFix: 'In C, memory allocated with malloc() must be explicitly released via free(temp) to prevent memory leaks.'
      }
    ],
    quickQuestions: [
      {
        id: 'q-ll-1',
        type: 'mcq',
        question: 'What happens if you execute "head = newNode" before "newNode->next = head"?',
        options: ['The list works properly', 'The rest of the list is permanently lost (Memory Leak)', 'Compiler error', 'Segmentation fault immediately'],
        correctAnswer: 1,
        explanation: 'Overwriting head removes the only pointer to the previous first node, stranding all existing nodes in memory without reference.',
        difficulty: 'Easy',
        unit: 2,
        topicId: 'linked-list'
      }
    ]
  },

  {
    id: 'u2-doubly-circular-list',
    unitId: 2,
    title: 'Doubly & Circular Linked Lists',
    subtitle: 'Two-Way Navigation, Circular Wraparound & Polynomial Representation',
    category: 'core',
    readTimeMin: 9,
    visualizerType: 'linked-list',
    whatIsIt: {
      english: 'A Doubly Linked List (DLL) has nodes with two pointers: next (forward) and prev (backward), allowing bidirectional traversal. A Circular Linked List (CLL) has its last node\'s next pointer directed back to head instead of NULL, forming a continuous ring.',
      hinglish: 'Doubly Linked List mein har node ke paas do pointers hote hain: prev aur next. Isme aage aur peeche dono taraf ja sakte hain. Circular list mein aakhri node NULL ki jagah wapas pehle node (head) ko point karta hai.'
    },
    beginnerGlossary: [
      {
        term: 'Bidirectional Traversal',
        explanation: 'Ability to navigate both forward and backward through nodes in a list.',
        hinglishExplanation: 'Aage aur peeche dono taraf traverse kar paana.'
      },
      {
        term: 'Polynomial Representation',
        explanation: 'Representing mathematical polynomials where each node stores a coefficient, exponent, and next pointer: [coeff | exp | next].',
        hinglishExplanation: 'Algebraic equations jaise 4x³ + 2x + 5 ko linked list ke nodes mein store karna.'
      }
    ],
    analogy: {
      title: 'Train Coaches vs Carousel',
      english: 'A Doubly Linked List is like passenger train carriages: each carriage is physically coupled to the one ahead and the one behind. A Circular Linked List is like a carousel or roundabout: walking continuously brings you back to where you started without ever hitting a dead end.',
      hinglish: 'Doubly list train ke dabbe jaisi hai jahan aage aur peeche dono taraf door hota hai. Circular list gol jhoole jaisi hai jisme ghoomte raho toh end nahi aata, wapas shuruat par aa jaoge.'
    },
    algorithm: {
      title: 'Deletion in Doubly Linked List (Node P)',
      steps: [
        'If P is head: set head = P->next; if (head != NULL) head->prev = NULL.',
        'If P is not head: set P->prev->next = P->next.',
        'If P is not the last node: set P->next->prev = P->prev.',
        'Release memory: free(P).'
      ]
    },
    cCode: {
      title: 'Doubly Linked List Node Definition & Insertion in C',
      code: `#include <stdio.h>
#include <stdlib.h>

struct DNode {
    int data;
    struct DNode* prev;
    struct DNode* next;
};

struct DNode* insertAtFront(struct DNode* head, int val) {
    struct DNode* newNode = (struct DNode*)malloc(sizeof(struct DNode));
    newNode->data = val;
    newNode->prev = NULL;
    newNode->next = head;
    
    if (head != NULL) {
        head->prev = newNode;
    }
    head = newNode;
    return head;
}

int main() {
    struct DNode* head = NULL;
    head = insertAtFront(head, 20);
    head = insertAtFront(head, 10);
    printf("DLL Created successfully with head data: %d\\n", head->data);
    return 0;
}`,
      isCompilable: true,
      sampleInput: 'None',
      expectedOutput: 'DLL Created successfully with head data: 10'
    },
    lineExplanations: [
      {
        line: 16,
        code: 'if (head != NULL) head->prev = newNode;',
        explanation: 'If the list was not previously empty, link the old head back to the newly inserted node.'
      }
    ],
    complexity: {
      timeBest: 'O(1) - Insertion/Deletion at ends',
      timeAverage: 'O(n) - Search/Update',
      timeWorst: 'O(n)',
      space: 'O(n) - Two pointers per node',
      reasoning: 'Consumes more memory than Singly Linked List because each node stores two pointers (prev and next).',
      hinglishReasoning: 'Singly list se zyada memory lagti hai kyunki har node do pointers (prev aur next) store karta hai.'
    },
    examAnswers: [
      {
        marks: 5,
        question: 'Explain how polynomials are represented and added using linked lists.',
        answer: 'In C, a polynomial node is defined as:\nstruct PolyNode {\n    int coeff;\n    int exp;\n    struct PolyNode* next;\n};\n\nPolynomial Addition Algorithm:\n1. Maintain two pointers p1 and p2 at the heads of both polynomials.\n2. While both p1 and p2 are not NULL:\n   - If p1->exp == p2->exp: add coefficients (sum = p1->coeff + p2->coeff). If sum != 0, insert [sum, exp] into result list. Advance both p1 and p2.\n   - If p1->exp > p2->exp: insert [p1->coeff, p1->exp] into result list and advance p1.\n   - If p2->exp > p1->exp: insert [p2->coeff, p2->exp] into result list and advance p2.\n3. Append any remaining nodes of p1 or p2 to the result list.',
        keyPoints: [
          'Show struct PolyNode definition with coeff and exp',
          'Explain 3 comparison cases (exp1 == exp2, exp1 > exp2, exp2 > exp1)',
          'Handling remaining terms after one list finishes',
          'Complexity is O(m + n) where m and n are terms in each polynomial'
        ]
      }
    ],
    commonMistakes: [
      {
        mistake: 'In Circular Linked List traversal, using while (current != NULL).',
        whyItHappens: 'Habit from Singly Linked List.',
        howToFix: 'In CLL, current will NEVER become NULL! The loop will run infinitely. Use while (current->next != head) or do-while loop.'
      }
    ],
    quickQuestions: [
      {
        id: 'q-dll-1',
        type: 'mcq',
        question: 'What is the condition to check if a Circular Singly Linked List with head pointer is empty?',
        options: ['head == NULL', 'head->next == NULL', 'head->next == head', 'head == -1'],
        correctAnswer: 0,
        explanation: 'Just like a normal linked list, if head is NULL, the circular list contains 0 nodes.',
        difficulty: 'Easy',
        unit: 2,
        topicId: 'linked-list'
      }
    ]
  },

  {
    id: 'u2-hashing-collisions',
    unitId: 2,
    title: 'Hashing & Collision Resolution Techniques',
    subtitle: 'Separate Chaining, Linear Probing, Quadratic Probing & Double Hashing',
    category: 'core',
    readTimeMin: 9,
    visualizerType: 'hashing',
    whatIsIt: {
      english: 'Hashing maps large key values to small integer indices in a Hash Table using a Hash Function h(k). A collision occurs when two distinct keys yield the same hash index: h(k₁) = h(k₂). Collision resolution techniques resolve this either via Open Hashing (Separate Chaining) or Closed Hashing (Open Addressing).',
      hinglish: 'Hashing ek aisi technique hai jo kisi bhi key ko ek mathematical formula (hash function) se array ke index mein badal deti hai. Jab do alag keys ka same index nikal aata hai, use Collision kehte hain.'
    },
    beginnerGlossary: [
      {
        term: 'Load Factor (λ)',
        explanation: 'Ratio of number of stored elements (n) to total hash table slots (m): λ = n / m.',
        hinglishExplanation: 'Hash table kitna bhara hua hai: n / table size.'
      },
      {
        term: 'Separate Chaining',
        explanation: 'Each hash table bucket points to a linked list of records that hash to the same slot.',
        hinglishExplanation: 'Har index par ek linked list laga dena taaki takraane wale elements chain mein judte jayein.'
      },
      {
        term: 'Open Addressing',
        explanation: 'All elements are stored within the table itself. If a collision occurs, alternative slots are probed.',
        hinglishExplanation: 'Bina linked list banaye, table ke agle khali slot mein data rakhna.'
      }
    ],
    analogy: {
      title: 'Assigned Parking Spaces',
      english: 'Imagine a parking lot with numbered spots based on your license plate\'s last digit. If spot #4 is taken when another car ending in 4 arrives: in Linear Probing, you simply park in the very next open spot (#5, #6, etc.). In Separate Chaining, spot #4 has a multi-story car elevator that stacks all cars ending in 4 vertically!',
      hinglish: 'Parking lot jaisa: agar aapki fixed parking spot par pehle se gaadi khadi hai, toh aap agle khali slot par gaadi laga dete ho (Linear Probing), ya phir usi jagah par stack karte ho (Chaining).'
    },
    algorithm: {
      title: 'Linear Probing Insertion',
      steps: [
        'Compute base hash index: index = key % TableSize.',
        'If table[index] is empty, insert key and return.',
        'If collision occurs, probe sequence: new_index = (index + i) % TableSize for i = 1, 2, 3...',
        'Continue probing until an empty cell is found or table is fully scanned (Table Full).'
      ]
    },
    cCode: {
      title: 'Hash Table with Linear Probing in C',
      code: `#include <stdio.h>
#define SIZE 7
#define EMPTY -1

int hashTable[SIZE];

void init() {
    for (int i = 0; i < SIZE; i++) hashTable[i] = EMPTY;
}

void insert(int key) {
    int index = key % SIZE;
    int i = 0;
    while (hashTable[(index + i) % SIZE] != EMPTY && i < SIZE) {
        i++; // Linear probing
    }
    if (i == SIZE) {
        printf("Hash Table is Full! Cannot insert %d\\n", key);
    } else {
        int finalIdx = (index + i) % SIZE;
        hashTable[finalIdx] = key;
        printf("Inserted key %d at index %d (Probes: %d)\\n", key, finalIdx, i);
    }
}

int main() {
    init();
    insert(10); // 10 % 7 = 3
    insert(17); // 17 % 7 = 3 (Collision! Probes to 4)
    insert(24); // 24 % 7 = 3 (Collision! Probes to 5)
    return 0;
}`,
      isCompilable: true,
      sampleInput: 'Keys: 10, 17, 24 into size 7',
      expectedOutput: 'Inserted key 10 at index 3 (Probes: 0)\nInserted key 17 at index 4 (Probes: 1)\nInserted key 24 at index 5 (Probes: 2)'
    },
    lineExplanations: [
      {
        line: 14,
        code: 'while (hashTable[(index + i) % SIZE] != EMPTY && i < SIZE)',
        explanation: 'Checks consecutive slots cyclically using modulo arithmetic until an empty slot is discovered.'
      }
    ],
    complexity: {
      timeBest: 'O(1) - No collisions',
      timeAverage: 'O(1) - Constant search and insert',
      timeWorst: 'O(n) - When all keys hash to the same bucket (clustering)',
      space: 'O(m) - Table size',
      reasoning: 'Average time complexity is O(1) provided the load factor λ remains below 0.7.',
      hinglishReasoning: 'Agar collisions kam hain toh O(1) mein search aur insert hota hai, par sab collide ho gaye toh O(n) lag sakta hai.'
    },
    examAnswers: [
      {
        marks: 5,
        question: 'Differentiate between Separate Chaining and Open Addressing.',
        answer: 'Criteria | Separate Chaining (Open Hashing) | Open Addressing (Closed Hashing)\n---|---|---\nStorage | Keys stored in external linked lists outside table | All keys stored inside the hash table array itself\nLoad Factor (λ) | Can be greater than 1 (λ > 1) | Must strictly be less than 1 (λ < 1)\nCollision Handling | Appends colliding item to linked list | Probes alternative slots (Linear, Quadratic, Double Hash)\nDeletion | Simple: standard linked list node deletion | Complex: requires marker flag (DELETED / tombstone)\nClustering | No primary clustering problems | Vulnerable to primary and secondary clustering',
        keyPoints: [
          'External lists vs fixed internal array slots',
          'Load factor limits (λ > 1 vs λ < 1)',
          'Deletion complexity (simple vs dummy/tombstone markers)',
          'Primary clustering in linear probing'
        ]
      }
    ],
    commonMistakes: [
      {
        mistake: 'Leaving deleted slots as EMPTY in Linear Probing.',
        whyItHappens: 'Setting cell to -1 stops subsequent searches prematurely.',
        howToFix: 'Use a special DELETED marker (tombstone) so that searching continues past the deleted cell.'
      }
    ],
    quickQuestions: [
      {
        id: 'q-hash-1',
        type: 'mcq',
        question: 'In a hash table of size 10 using hash function h(k) = k % 10 with linear probing, where is key 42 placed if key 32 is already inserted?',
        options: ['Index 2', 'Index 3', 'Index 4', 'Index 0'],
        correctAnswer: 1,
        explanation: '42 % 10 = 2. Slot 2 is occupied by 32. Linear probing checks slot (2 + 1) % 10 = 3, which is empty.',
        difficulty: 'Easy',
        unit: 2,
        topicId: 'hashing'
      }
    ]
  },

  // ==========================================
  // UNIT III: STACKS, RECURSION & QUEUES
  // ==========================================
  {
    id: 'u3-stack-adt',
    unitId: 3,
    title: 'Stack ADT: Array & Linked List Implementation',
    subtitle: 'LIFO Principle, Push, Pop, Peek, Overflow & Underflow Conditions',
    category: 'core',
    readTimeMin: 9,
    visualizerType: 'stack',
    whatIsIt: {
      english: 'A Stack is a linear Abstract Data Type (ADT) that follows the LIFO (Last In, First Out) principle. All insertions (push) and deletions (pop) occur at a single designated end called "top".',
      hinglish: 'Stack ek LIFO (Last In First Out) data structure hai. Jo element sabse aakhri mein daala jaata hai, wahi sabse pehle bahar nikalta hai. Saare operations sirf ek end "top" se hote hain.'
    },
    beginnerGlossary: [
      {
        term: 'Overflow Condition',
        explanation: 'Attempting to push an element into a stack that has reached maximum capacity (top == MAX - 1 in array).',
        hinglishExplanation: 'Poore bhare hue stack mein aur element daalne ki koshish karna.'
      },
      {
        term: 'Underflow Condition',
        explanation: 'Attempting to pop an element from an already empty stack (top == -1).',
        hinglishExplanation: 'Khali stack mein se element nikalne ki koshish karna.'
      }
    ],
    analogy: {
      title: 'A Stack of Dinner Plates in a Cafeteria',
      english: 'When clean plates are placed onto a spring-loaded tray, the last plate placed on top is the first plate taken by the next diner. You cannot pull out the bottom plate without first removing all the plates stacked above it!',
      hinglish: 'Shaadi ki plates ka dher: jo plate sabse upar rakhi jaati hai, log wahi sabse pehle uthate hain. Niche wali plate nikalne ke liye upar ki saari plates hatani padti hain.'
    },
    algorithm: {
      title: 'Stack Push and Pop Operations (Array-based)',
      steps: [
        'Push(val): Check if top == MAX - 1. If yes, print "Stack Overflow" and exit.',
        'Increment top: top = top + 1.',
        'Assign value: stack[top] = val.',
        'Pop(): Check if top == -1. If yes, print "Stack Underflow" and return -1.',
        'Save popped value: val = stack[top].',
        'Decrement top: top = top - 1; return val.'
      ]
    },
    cCode: {
      title: 'Array Implementation of Stack in C',
      code: `#include <stdio.h>
#define MAX 5

struct Stack {
    int items[MAX];
    int top;
};

void init(struct Stack* s) {
    s->top = -1; // Stack initialized to empty
}

int isFull(struct Stack* s) {
    return s->top == MAX - 1;
}

int isEmpty(struct Stack* s) {
    return s->top == -1;
}

void push(struct Stack* s, int val) {
    if (isFull(s)) {
        printf("Stack Overflow! Cannot push %d\\n", val);
        return;
    }
    s->items[++(s->top)] = val;
    printf("Pushed %d to stack (top = %d)\\n", val, s->top);
}

int pop(struct Stack* s) {
    if (isEmpty(s)) {
        printf("Stack Underflow! Stack is empty.\\n");
        return -1;
    }
    return s->items[(s->top)--];
}

int peek(struct Stack* s) {
    if (isEmpty(s)) return -1;
    return s->items[s->top];
}

int main() {
    struct Stack s;
    init(&s);
    push(&s, 10);
    push(&s, 20);
    push(&s, 30);
    printf("Top element: %d\\n", peek(&s));
    printf("Popped: %d\\n", pop(&s));
    printf("New top after pop: %d\\n", peek(&s));
    return 0;
}`,
      isCompilable: true,
      sampleInput: 'Pushes: 10, 20, 30',
      expectedOutput: 'Pushed 10 to stack (top = 0)\nPushed 20 to stack (top = 1)\nPushed 30 to stack (top = 2)\nTop element: 30\nPopped: 30\nNew top after pop: 20'
    },
    lineExplanations: [
      {
        line: 25,
        code: 's->items[++(s->top)] = val;',
        explanation: 'Pre-increment increases top first (from -1 to 0 on first push), then stores value at that new index.'
      },
      {
        line: 34,
        code: 'return s->items[(s->top)--];',
        explanation: 'Post-decrement returns current top item first, then lowers top index.'
      }
    ],
    complexity: {
      timeBest: 'O(1) - Push, Pop, Peek are all constant time',
      timeAverage: 'O(1)',
      timeWorst: 'O(1)',
      space: 'O(MAX) - Array implementation',
      reasoning: 'Stack operations manipulate only the index top directly without searching or shifting elements.',
      hinglishReasoning: 'Top pointer direct access karta hai isliye Push aur Pop dono O(1) time mein ho jaate hain.'
    },
    examAnswers: [
      {
        marks: 5,
        question: 'Write an algorithm to evaluate a Postfix Expression using a stack. Evaluate: 5 3 + 2 *',
        answer: 'Algorithm:\n1. Create an empty stack.\n2. Scan postfix expression from left to right token by token.\n3. If token is an OPERAND (number): push it onto the stack.\n4. If token is an OPERATOR (+, -, *, /):\n   - Pop operand2 = pop().\n   - Pop operand1 = pop().\n   - Result = operand1 (operator) operand2.\n   - Push Result back onto the stack.\n5. At end of expression, the single element left in stack is the final result.\n\nEvaluation of "5 3 + 2 *":\n- Token 5: Push 5 -> Stack: [5]\n- Token 3: Push 3 -> Stack: [5, 3]\n- Token +: Pop op2=3, op1=5. Compute 5 + 3 = 8. Push 8 -> Stack: [8]\n- Token 2: Push 2 -> Stack: [8, 2]\n- Token *: Pop op2=2, op1=8. Compute 8 * 2 = 16. Push 16 -> Stack: [16]\n\nFinal Result = 16',
        keyPoints: [
          'State step-by-step algorithm clearly',
          'Caution note: First popped is operand2, second popped is operand1 (crucial for - and /)',
          'Show stack snapshot table at each step for full marks'
        ]
      }
    ],
    commonMistakes: [
      {
        mistake: 'Reversing operand order during subtraction or division in postfix evaluation: op2 - op1 instead of op1 - op2.',
        whyItHappens: 'Because op2 was popped first, students write op2 - op1.',
        howToFix: 'The earlier element is the left operand: op1 - op2 and op1 / op2.'
      }
    ],
    quickQuestions: [
      {
        id: 'q-stk-1',
        type: 'mcq',
        question: 'If elements A, B, C are pushed into a stack in that order, what is the order of removal?',
        options: ['A, B, C', 'C, B, A', 'B, C, A', 'C, A, B'],
        correctAnswer: 1,
        explanation: 'By the LIFO rule, C is on top and pops first, followed by B, then A.',
        difficulty: 'Easy',
        unit: 3,
        topicId: 'stack'
      }
    ]
  },

  {
    id: 'u3-recursion-hanoi',
    unitId: 3,
    title: 'Recursion Principles, Call Stack & Tower of Hanoi',
    subtitle: 'Base Case, Unwinding Call Stack & Hanoi Move Formulations',
    category: 'core',
    readTimeMin: 10,
    visualizerType: 'recursion',
    whatIsIt: {
      english: 'Recursion is a programming technique where a function calls itself directly or indirectly to solve smaller instances of the same problem. Every recursive function requires two essential components: a Base Case (stopping condition) and a Recursive Step (moving toward the base case). The operating system manages function calls using the Runtime Call Stack.',
      hinglish: 'Recursion mein function apne aap ko dobara call karta hai. Do cheezein mandatory hain: Base Case (kab rukna hai) aur Recursive Call. Har function call computer ke Call Stack par frame bankar baithti hai.'
    },
    beginnerGlossary: [
      {
        term: 'Base Case',
        explanation: 'The terminating condition that returns a value directly without making further recursive calls.',
        hinglishExplanation: 'Rukne ki shart. Agar base case nahi hoga toh program Stack Overflow crash ho jayega.'
      },
      {
        term: 'Call Stack Frame',
        explanation: 'A block of memory containing local variables, parameters, and return address of an active function call.',
        hinglishExplanation: 'RAM mein har active function call ka hisaab-kitaab.'
      }
    ],
    analogy: {
      title: 'Russian Matryoshka Dolls',
      english: 'Opening a nested Russian doll reveals a smaller doll inside. You continue opening dolls until you reach the tiniest solid wooden doll that cannot be opened (Base Case!). You then assemble the dolls back in reverse order (Stack unwinding).',
      hinglish: 'Russian doll jaisa: har doll ke andar ek choti doll hoti hai, aakhri mein ek solid doll aati hai jo khulti nahi (Base Case). Wahan se hum wapas sabko band karte hain.'
    },
    algorithm: {
      title: 'Tower of Hanoi for n Disks (Source S, Auxiliary A, Destination D)',
      steps: [
        'Base Case: If n == 1, move disk 1 directly from S to D, and return.',
        'Recursive Step 1: Move top (n - 1) disks from S to A using D as auxiliary.',
        'Move nth (largest) disk directly from S to D.',
        'Recursive Step 2: Move the (n - 1) disks from A to D using S as auxiliary.'
      ]
    },
    cCode: {
      title: 'Tower of Hanoi Solution in C',
      code: `#include <stdio.h>

void towerOfHanoi(int n, char from_rod, char to_rod, char aux_rod) {
    if (n == 1) {
        printf("Move disk 1 from rod %c to rod %c\\n", from_rod, to_rod);
        return;
    }
    // Step 1: Move n-1 disks from Source to Aux
    towerOfHanoi(n - 1, from_rod, aux_rod, to_rod);
    
    // Step 2: Move remaining 1 disk from Source to Dest
    printf("Move disk %d from rod %c to rod %c\\n", n, from_rod, to_rod);
    
    // Step 3: Move n-1 disks from Aux to Dest
    towerOfHanoi(n - 1, aux_rod, to_rod, from_rod);
}

int main() {
    int n = 3; // 3 disks
    printf("Tower of Hanoi Moves for %d disks:\\n", n);
    towerOfHanoi(n, 'A', 'C', 'B');
    return 0;
}`,
      isCompilable: true,
      sampleInput: 'n = 3 disks from A to C using B',
      expectedOutput: 'Move disk 1 from rod A to rod C\nMove disk 2 from rod A to rod B\nMove disk 1 from rod C to rod B\nMove disk 3 from rod A to rod C\nMove disk 1 from rod B to rod A\nMove disk 2 from rod B to rod C\nMove disk 1 from rod A to rod C'
    },
    lineExplanations: [
      {
        line: 4,
        code: 'if (n == 1)',
        explanation: 'Base case: A single disk requires no auxiliary coordination and moves straight to destination rod.'
      },
      {
        line: 9,
        code: 'towerOfHanoi(n - 1, from_rod, aux_rod, to_rod);',
        explanation: 'Recursively clears the way by shifting top n-1 disks off the source peg onto auxiliary peg.'
      }
    ],
    complexity: {
      timeBest: 'O(2ⁿ)',
      timeAverage: 'O(2ⁿ)',
      timeWorst: 'O(2ⁿ)',
      space: 'O(n) - Maximum depth of call stack',
      reasoning: 'Recurrence relation: T(n) = 2T(n-1) + 1. Total moves required for n disks is exactly 2ⁿ - 1.',
      hinglishReasoning: 'Har disk ke liye moves double hote jaate hain (2ⁿ - 1). 3 disks ke liye 7 moves, 4 ke liye 15 moves lagte hain.'
    },
    examAnswers: [
      {
        marks: 5,
        question: 'Prove that the total number of moves in Tower of Hanoi with n disks is 2ⁿ - 1 using mathematical induction.',
        answer: 'Let M(n) be the number of moves for n disks.\nRecurrence relation: M(n) = 2 * M(n-1) + 1 with base condition M(1) = 1.\n\nBasis Step:\nFor n = 1: M(1) = 2¹ - 1 = 1. True.\n\nInductive Hypothesis:\nAssume formula holds for n = k, i.e., M(k) = 2ᵏ - 1.\n\nInductive Step:\nFor n = k + 1 disks:\nTo move k + 1 disks:\n1. Move k disks from S to A: M(k) moves\n2. Move largest disk from S to D: 1 move\n3. Move k disks from A to D: M(k) moves\nTotal M(k + 1) = 2 * M(k) + 1\nSubstitute hypothesis: M(k + 1) = 2 * (2ᵏ - 1) + 1\n= 2^(k+1) - 2 + 1\n= 2^(k+1) - 1.\n\nHence proved by mathematical induction: M(n) = 2ⁿ - 1.',
        keyPoints: [
          'State recurrence: M(n) = 2M(n-1) + 1',
          'Base step verification for n = 1',
          'Inductive hypothesis substitution',
          'Conclusion showing 2ⁿ - 1'
        ]
      }
    ],
    commonMistakes: [
      {
        mistake: 'Omitting the base case in recursion.',
        whyItHappens: 'Thinking the function will automatically know when to stop.',
        howToFix: 'Without a base case, recursion leads to infinite calls and "Segmentation Fault / Stack Overflow".'
      }
    ],
    quickQuestions: [
      {
        id: 'q-rec-1',
        type: 'mcq',
        question: 'How many total moves are required to solve Tower of Hanoi with 4 disks?',
        options: ['8', '15', '16', '7'],
        correctAnswer: 1,
        explanation: 'Formula is 2ⁿ - 1. For n = 4: 2⁴ - 1 = 16 - 1 = 15 moves.',
        difficulty: 'Easy',
        unit: 3,
        topicId: 'recursion'
      }
    ]
  },

  {
    id: 'u3-queues-circular',
    unitId: 3,
    title: 'Linear & Circular Queues, Deque and Priority Queue',
    subtitle: 'FIFO, Space Wastage Problem & Modulo Wraparound Formula',
    category: 'core',
    readTimeMin: 9,
    visualizerType: 'queue',
    whatIsIt: {
      english: 'A Queue is a linear FIFO (First In, First Out) data structure. Insertions occur at the "rear" end and deletions occur at the "front" end. A Linear Queue suffers from false overflow: memory at the front is wasted after deletions. A Circular Queue solves this by wrapping rear around to index 0 using modulo arithmetic: (rear + 1) % MAX.',
      hinglish: 'Queue ek FIFO (First In First Out) line hai. Naye log line ke peeche (rear) judte hain aur aage (front) se log nikalte hain. Linear queue mein aage khali jagah hone par bhi naya data insert nahi ho pata (space wastage), jise Circular Queue modulo formula se solve karta hai.'
    },
    beginnerGlossary: [
      {
        term: 'FIFO (First In First Out)',
        explanation: 'The element inserted first is the first one removed.',
        hinglishExplanation: 'Jo pehle aaya wahi pehle paya.'
      },
      {
        term: 'Circular Queue Full Condition',
        explanation: 'Evaluates to true when (rear + 1) % MAX == front.',
        hinglishExplanation: 'Jab rear ka agla step front tak pahunch jaye.'
      }
    ],
    analogy: {
      title: 'Ticket Counter Line vs Roundabout',
      english: 'A linear queue is like a cinema ticket line where people leave from the front, but the line cannot slide forward to re-use the empty space. A circular queue is a merry-go-round where empty seats in front immediately become available to newcomers behind!',
      hinglish: 'Cinema hall ki ticket line: aage se log ticket lekar chale gaye par peeche se guard kehta hai "Jagah khatam". Circular queue mein jaise hi aage jagah khali hoti hai, naye log ghoom kar wahan baith sakte hain.'
    },
    algorithm: {
      title: 'Circular Queue Enqueue and Dequeue',
      steps: [
        'Enqueue(val): Check if (rear + 1) % MAX == front. If yes, print "Queue is Full" and return.',
        'If front == -1 (first insertion), set front = 0 and rear = 0.',
        'Else, set rear = (rear + 1) % MAX.',
        'Assign cq[rear] = val.',
        'Dequeue(): Check if front == -1. If yes, print "Queue is Empty" and return -1.',
        'Save val = cq[front].',
        'If front == rear (only one element was present), reset front = -1, rear = -1.',
        'Else, set front = (front + 1) % MAX; return val.'
      ]
    },
    cCode: {
      title: 'Circular Queue Implementation in C',
      code: `#include <stdio.h>
#define SIZE 5

int items[SIZE];
int front = -1, rear = -1;

int isFull() {
    return (rear + 1) % SIZE == front;
}

int isEmpty() {
    return front == -1;
}

void enQueue(int value) {
    if (isFull()) {
        printf("Circular Queue is Full! Cannot enqueue %d\\n", value);
        return;
    }
    if (front == -1) front = 0;
    rear = (rear + 1) % SIZE;
    items[rear] = value;
    printf("Enqueued %d at index %d (front=%d, rear=%d)\\n", value, rear, front, rear);
}

int deQueue() {
    if (isEmpty()) {
        printf("Queue is Empty!\\n");
        return -1;
    }
    int element = items[front];
    if (front == rear) {
        // Last element dequeued, reset queue
        front = -1;
        rear = -1;
    } else {
        front = (front + 1) % SIZE;
    }
    return element;
}

int main() {
    enQueue(10);
    enQueue(20);
    enQueue(30);
    printf("Dequeued: %d\\n", deQueue());
    enQueue(40);
    enQueue(50);
    enQueue(60); // Wraps around into freed space!
    return 0;
}`,
      isCompilable: true,
      sampleInput: 'Enqueue 10,20,30, Dequeue, Enqueue 40,50,60',
      expectedOutput: 'Enqueued 10...\nDequeued: 10\nEnqueued 40...\nEnqueued 50...\nEnqueued 60 at index 0 (front=1, rear=0)'
    },
    lineExplanations: [
      {
        line: 8,
        code: 'return (rear + 1) % SIZE == front;',
        explanation: 'Modulo arithmetic tests if the very next slot after rear is currently front, indicating zero free slots.'
      },
      {
        line: 20,
        code: 'rear = (rear + 1) % SIZE;',
        explanation: 'When rear reaches SIZE - 1 (end of array), (SIZE - 1 + 1) % SIZE wraps back to 0 cleanly.'
      }
    ],
    complexity: {
      timeBest: 'O(1) - Enqueue and Dequeue',
      timeAverage: 'O(1)',
      timeWorst: 'O(1)',
      space: 'O(SIZE) - Array allocation',
      reasoning: 'Circular queue operations access front and rear indices in constant arithmetic steps.',
      hinglishReasoning: 'Direct index computation hai isliye O(1) time lagta hai.'
    },
    examAnswers: [
      {
        marks: 5,
        question: 'Why is a Circular Queue preferred over a Linear Queue? Explain with a diagram.',
        answer: 'Drawback of Linear Queue:\nIn a linear queue using an array of size MAX, when elements are inserted, rear moves right. When elements are deleted, front moves right. When rear == MAX - 1, no further insertion is possible, even if front has moved ahead leaving slots 0 to front-1 completely empty! This is called "False Overflow" or space wastage.\n\nHow Circular Queue Solves It:\nA Circular Queue treats the array as a ring by joining the last position back to the first position using modulo arithmetic:\nrear = (rear + 1) % MAX\nfront = (front + 1) % MAX\nThis allows new elements to wrap around and occupy previously deleted front slots, ensuring 100% space utilization.',
        keyPoints: [
          'Define False Overflow in linear queue',
          'Explain empty front slots cannot be reused in linear queue',
          'Modulo arithmetic formula for circular wraparound',
          'Memory utilization benefit'
        ]
      }
    ],
    commonMistakes: [
      {
        mistake: 'Using rear == front for queue full condition.',
        whyItHappens: 'Confusing empty reset state with full state.',
        howToFix: 'When queue is empty after single element removal, front == rear. For full condition, use (rear + 1) % SIZE == front.'
      }
    ],
    quickQuestions: [
      {
        id: 'q-q-1',
        type: 'mcq',
        question: 'In a circular queue of size 5, if front = 2 and rear = 1, what is the status of the queue?',
        options: ['Queue is Empty', 'Queue is Full', 'Contains 1 element', 'Invalid state'],
        correctAnswer: 1,
        explanation: '(rear + 1) % SIZE = (1 + 1) % 5 = 2 == front. Therefore, the circular queue is completely full.',
        difficulty: 'Medium',
        unit: 3,
        topicId: 'queue'
      }
    ]
  },

  // ==========================================
  // UNIT IV: TREES & BST
  // ==========================================
  {
    id: 'u4-binary-search-tree',
    unitId: 4,
    title: 'Binary Search Trees (BST): Insert, Search & Delete',
    subtitle: 'BST Invariant, Traversal Orders & 3 Deletion Cases',
    category: 'core',
    readTimeMin: 11,
    visualizerType: 'tree',
    whatIsIt: {
      english: 'A Binary Search Tree (BST) is a hierarchical binary tree where every node satisfies the BST Property: all keys in its left subtree are strictly LESS than the node\'s key, and all keys in its right subtree are strictly GREATER than the node\'s key. Inorder traversal of a BST always produces elements in sorted ascending order!',
      hinglish: 'Binary Search Tree mein har node ke left taraf chote numbers hote hain aur right taraf bade numbers hote hain. Agar aap BST par Inorder Traversal chalao, toh saare elements automatic sorted order mein print hote hain!'
    },
    beginnerGlossary: [
      {
        term: 'Inorder Successor',
        explanation: 'The smallest node in a node\'s right subtree (found by going one step right, then all the way left).',
        hinglishExplanation: 'Kisi node ke baad aane wala just agla bada number (right subtree ka sabse chota node).'
      },
      {
        term: 'Leaf Node',
        explanation: 'A node with no children (both left == NULL and right == NULL).',
        hinglishExplanation: 'Aisa node jiska koi bacha nahi hota.'
      }
    ],
    analogy: {
      title: 'A High-Low Guessing Game',
      english: 'Imagine guessing a secret number between 1 and 100. If you guess 50 and are told "Too low!", you immediately discard 1 to 50 and search the right branch (51 to 100). That exact decision tree is a Binary Search Tree.',
      hinglish: 'Number guessing game jaisa: agar aapne 50 guess kiya aur computer ne kaha "Bada number socho", toh aap left ke 1-50 discard karke sirf right half mein dhundhte ho.'
    },
    algorithm: {
      title: 'BST Deletion (3 Cases)',
      steps: [
        'Search for node to be deleted: if key < root->key search left; else search right.',
        'Case 1 (Leaf Node): Node has 0 children. Simply free(node) and return NULL to parent.',
        'Case 2 (One Child): Node has 1 child. Bypass the node by linking its parent directly to its single child, then free(node).',
        'Case 3 (Two Children): Find the node\'s Inorder Successor (min node in right subtree). Copy successor\'s value into current node, then recursively delete the successor from the right subtree.'
      ]
    },
    cCode: {
      title: 'BST Insertion, Inorder Traversal & Search in C',
      code: `#include <stdio.h>
#include <stdlib.h>

struct TreeNode {
    int val;
    struct TreeNode* left;
    struct TreeNode* right;
};

struct TreeNode* createNode(int val) {
    struct TreeNode* newNode = (struct TreeNode*)malloc(sizeof(struct TreeNode));
    newNode->val = val;
    newNode->left = NULL;
    newNode->right = NULL;
    return newNode;
}

struct TreeNode* insert(struct TreeNode* root, int val) {
    if (root == NULL) return createNode(val);
    if (val < root->val) {
        root->left = insert(root->left, val);
    } else if (val > root->val) {
        root->right = insert(root->right, val);
    }
    return root;
}

// Inorder: Left -> Root -> Right (Produces Sorted Output!)
void inorder(struct TreeNode* root) {
    if (root != NULL) {
        inorder(root->left);
        printf("%d ", root->val);
        inorder(root->right);
    }
}

int main() {
    struct TreeNode* root = NULL;
    root = insert(root, 50);
    insert(root, 30);
    insert(root, 70);
    insert(root, 20);
    insert(root, 40);
    insert(root, 60);
    insert(root, 80);
    
    printf("Inorder Traversal (Sorted): ");
    inorder(root);
    printf("\\n");
    return 0;
}`,
      isCompilable: true,
      sampleInput: 'Keys: 50, 30, 70, 20, 40, 60, 80',
      expectedOutput: 'Inorder Traversal (Sorted): 20 30 40 50 60 70 80'
    },
    lineExplanations: [
      {
        line: 32,
        code: 'inorder(root->left); printf("%d ", root->val); inorder(root->right);',
        explanation: 'Traverses smaller items on left first, then visits root, then traverses larger items on right.'
      }
    ],
    complexity: {
      timeBest: 'O(log n) - Balanced BST search/insert/delete',
      timeAverage: 'O(log n)',
      timeWorst: 'O(n) - Degenerate/Skewed BST (resembles a linked list)',
      space: 'O(h) - Auxiliary call stack space equal to tree height',
      reasoning: 'On balanced BST, height h = log₂(n). In worst case (inserting 10, 20, 30, 40 in sorted order), tree becomes a right-skewed stick of height n.',
      hinglishReasoning: 'Agar tree balanced hai toh search O(log n) leta hai. Par agar numbers pehle se sorted insert kar diye toh tree stick (linked list) ban jata hai aur time O(n) ho jata hai.'
    },
    examAnswers: [
      {
        marks: 5,
        question: 'Explain the 3 cases of deleting a node from a Binary Search Tree with diagrams.',
        answer: 'Case 1: Node has NO children (Leaf Node)\n- Example: Delete 20.\n- Action: Set parent\'s link to NULL, and free memory of the leaf node.\n\nCase 2: Node has EXACTLY ONE child\n- Example: Delete a node having only a right child.\n- Action: Link parent of the node directly to its child, bypassing the deleted node.\n\nCase 3: Node has TWO children\n- Example: Delete node 50 having both left and right subtrees.\n- Action: We cannot simply remove it without breaking BST structure. Find its Inorder Successor (minimum value in right subtree). Replace node 50 with successor\'s value, then delete the successor node (which has at most one child!).',
        keyPoints: [
          'State Case 1 (Leaf), Case 2 (Single child), Case 3 (Two children)',
          'Define Inorder Successor for Case 3',
          'Mention why Inorder Predecessor can also be used alternatively'
        ]
      }
    ],
    commonMistakes: [
      {
        mistake: 'Directly freeing a node with two children without swapping its value with Inorder Successor.',
        whyItHappens: 'Beginners unlink the node and orphan both left and right children.',
        howToFix: 'Always overwrite data with inorder successor, then delete the successor.'
      }
    ],
    quickQuestions: [
      {
        id: 'q-bst-1',
        type: 'mcq',
        question: 'Which tree traversal on a BST yields nodes in ascending sorted order?',
        options: ['Preorder', 'Inorder', 'Postorder', 'Level order'],
        correctAnswer: 1,
        explanation: 'Inorder (Left -> Root -> Right) always visits smaller elements before root, and root before larger elements.',
        difficulty: 'Easy',
        unit: 4,
        topicId: 'tree'
      }
    ]
  },

  {
    id: 'u4-avl-rotations',
    unitId: 4,
    title: 'AVL Trees & Self-Balancing Rotations',
    subtitle: 'Balance Factor Calculation & 4 Rotation Types: LL, RR, LR, RL',
    category: 'advanced',
    readTimeMin: 10,
    visualizerType: 'tree',
    whatIsIt: {
      english: 'An AVL Tree (named after Adelson-Velsky and Landis) is a self-balancing Binary Search Tree where the Balance Factor (BF = Height(Left) - Height(Right)) of every node is strictly -1, 0, or +1. If an insertion or deletion causes |BF| > 1, the tree restores balance using tree rotations in O(1) time.',
      hinglish: 'AVL Tree ek self-balancing BST hai. Har node par Balance Factor = (Left height - Right height) check hota hai jo sirf -1, 0 ya +1 ho sakta hai. Agar imbalance hua toh Rotations (LL, RR, LR, RL) se tree turant balance ho jata hai.'
    },
    beginnerGlossary: [
      {
        term: 'Balance Factor (BF)',
        explanation: 'BF(Node) = Height(Left Subtree) - Height(Right Subtree). Valid values in AVL: {-1, 0, +1}.',
        hinglishExplanation: 'Left subtree ki unchai minus Right subtree ki unchai.'
      },
      {
        term: 'Tree Rotation',
        explanation: 'An O(1) local pointer reassignment that restores height balance while strictly preserving BST inorder keys.',
        hinglishExplanation: 'Bina BST ka order bigade nodes ke pointers ghumakar tree ki unchai kam karna.'
      }
    ],
    analogy: {
      title: 'A Playground See-Saw with Weights',
      english: 'Imagine a see-saw. If three heavy kids sit on the extreme left side, the see-saw is dangerously tilted (imbalanced). Shifting the middle child to sit directly on the central pivot restores perfect balance instantly!',
      hinglish: 'See-saw jaisa: agar sabhi bache ek hi side baith jayein toh jhula tedha ho jata hai. Beech wale ko center pivot par bithane se jhula turant balance ho jata hai.'
    },
    algorithm: {
      title: 'Identifying and Applying 4 AVL Rotations',
      steps: [
        'LL Imbalance: Inserted into Left subtree of Left child. Fix: Single Right Rotation.',
        'RR Imbalance: Inserted into Right subtree of Right child. Fix: Single Left Rotation.',
        'LR Imbalance: Inserted into Right subtree of Left child. Fix: Double Rotation (Left rotate left child, then Right rotate parent).',
        'RL Imbalance: Inserted into Left subtree of Right child. Fix: Double Rotation (Right rotate right child, then Left rotate parent).'
      ]
    },
    cCode: {
      title: 'Right and Left AVL Rotations in C',
      code: `#include <stdio.h>
#include <stdlib.h>

struct Node {
    int key;
    struct Node *left, *right;
    int height;
};

int max(int a, int b) { return (a > b) ? a : b; }
int height(struct Node *n) { return (n == NULL) ? 0 : n->height; }

// Right Rotation (fixes LL imbalance)
struct Node* rightRotate(struct Node *y) {
    struct Node *x = y->left;
    struct Node *T2 = x->right;
    
    // Perform rotation
    x->right = y;
    y->left = T2;
    
    // Update heights
    y->height = max(height(y->left), height(y->right)) + 1;
    x->height = max(height(x->left), height(x->right)) + 1;
    
    return x; // New root
}

// Left Rotation (fixes RR imbalance)
struct Node* leftRotate(struct Node *x) {
    struct Node *y = x->right;
    struct Node *T2 = y->left;
    
    y->left = x;
    x->right = T2;
    
    x->height = max(height(x->left), height(x->right)) + 1;
    y->height = max(height(y->left), height(y->right)) + 1;
    
    return y; // New root
}

int main() {
    printf("AVL Rotations compiled successfully with O(1) pointer updates!\\n");
    return 0;
}`,
      isCompilable: true,
      sampleInput: 'None',
      expectedOutput: 'AVL Rotations compiled successfully with O(1) pointer updates!'
    },
    lineExplanations: [
      {
        line: 16,
        code: 'x->right = y; y->left = T2;',
        explanation: 'Pivots node y downwards to become right child of x, while subtree T2 shifts smoothly to become left child of y.'
      }
    ],
    complexity: {
      timeBest: 'O(log n) - Search, Insert, Delete guaranteed',
      timeAverage: 'O(log n)',
      timeWorst: 'O(log n) - Guaranteed! Unlike normal BST',
      space: 'O(log n) - Height is strictly bounded by 1.44 log₂(n)',
      reasoning: 'Because balance factor never exceeds ±1, the tree height is strictly O(log n), preventing skewed stick degeneration.',
      hinglishReasoning: 'AVL tree kabhi tedha stick nahi banta, isliye worst-case mein bhi search O(log n) rehta hai.'
    },
    examAnswers: [
      {
        marks: 5,
        question: 'Insert keys 30, 20, 10 into an empty AVL tree and show the rotation step by step.',
        answer: 'Step 1: Insert 30\nTree: (30), BF = 0\n\nStep 2: Insert 20\nTree: 30 has left child 20.\nBF(30) = Height(Left) - Height(Right) = 1 - 0 = +1. Balanced.\n\nStep 3: Insert 10\nTree:\n    30 (BF = 2 - 0 = +2) -> CRITICAL NODE!\n   /\n  20 (BF = 1 - 0 = +1)\n /\n10\n\nImbalance Diagnosis:\nNode 10 was inserted into the LEFT subtree of the LEFT child of 30. This is an LL Imbalance.\n\nAction: Right Rotation about node 30.\n- Node 20 becomes the new root.\n- Node 10 remains left child of 20.\n- Node 30 becomes right child of 20.\n\nFinal Balanced Tree:\n    20 (BF = 0)\n   /  \\\n 10    30 (BF = 0)',
        keyPoints: [
          'Calculate BF after every insertion',
          'Identify critical node where BF becomes +2',
          'Diagnose LL pattern',
          'Draw resultant balanced tree with new root 20'
        ]
      }
    ],
    commonMistakes: [
      {
        mistake: 'Using a single rotation to fix an LR or RL imbalance.',
        whyItHappens: 'Attempting to rotate the parent directly without first converting zigzag to straight line.',
        howToFix: 'LR and RL are zig-zag imbalances requiring DOUBLE rotations (first rotate child, then rotate parent).'
      }
    ],
    quickQuestions: [
      {
        id: 'q-avl-1',
        type: 'mcq',
        question: 'What is the allowable balance factor for any node in an AVL tree?',
        options: ['Only 0', '-1, 0, or +1', '-2, -1, 0, 1, 2', 'Any positive number'],
        correctAnswer: 1,
        explanation: 'By AVL definition, height difference |Height(Left) - Height(Right)| must be <= 1, so BF in {-1, 0, +1}.',
        difficulty: 'Easy',
        unit: 4,
        topicId: 'tree'
      }
    ]
  },

  // ==========================================
  // UNIT V: GRAPHS & ALGORITHMS
  // ==========================================
  {
    id: 'u5-graph-traversals',
    unitId: 5,
    title: 'Graph Traversals: BFS (Queue) & DFS (Stack/Recursion)',
    subtitle: 'Adjacency Matrix vs List, Connected Components & Traversal Tracing',
    category: 'core',
    readTimeMin: 10,
    visualizerType: 'graph',
    whatIsIt: {
      english: 'A Graph G = (V, E) consists of a set of vertices (nodes) and edges (connections). Breadth-First Search (BFS) explores vertices layer by layer in concentric waves using a Queue. Depth-First Search (DFS) dives deeply along a branch as far as possible before backtracking using a Stack or recursion. A visited array prevents infinite loops in cyclic graphs.',
      hinglish: 'Graph vertices aur edges ka collection hota hai. BFS layer-by-layer chalta hai aur Queue use karta hai. DFS gehrai mein aage badhta hai jab tak rasta khatam na ho jaye, aur Stack ya Recursion use karta hai.'
    },
    beginnerGlossary: [
      {
        term: 'Visited Array',
        explanation: 'A boolean array visited[V] tracking whether a vertex has already been discovered to avoid cycling infinitely.',
        hinglishExplanation: 'Ek array jo yaad rakhta hai kaunsa room pehle se visit ho chuka hai.'
      },
      {
        term: 'Adjacency Matrix vs List',
        explanation: 'Adjacency Matrix uses V x V 2D array (O(V²) space). Adjacency List uses an array of linked lists (O(V + E) space).',
        hinglishExplanation: 'Matrix 2D table hoti hai jo O(V²) jagah leti hai. List sirf exist karne wale connections rakhti hai.'
      }
    ],
    analogy: {
      title: 'Ripples in a Pond vs Exploring a Maze',
      english: 'BFS is like dropping a stone in water: ripples expand outward equally in all directions (distance 1, distance 2, distance 3). DFS is like exploring an ancient labyrinth with a ball of string: you keep walking down a corridor until you hit a dead end, then rewind your string to try the next path.',
      hinglish: 'BFS paani mein patthar fekne jaisa hai: tarangein charo taraf barabar failti hain. DFS bhool-bhulaiya (maze) mein chalne jaisa hai: ek raste par tab tak jao jab tak band deewar na aa jaye, phir peeche aao.'
    },
    algorithm: {
      title: 'Breadth-First Search (BFS) Algorithm',
      steps: [
        'Initialize boolean visited[V] = {false} and create an empty Queue Q.',
        'Choose start vertex s. Set visited[s] = true and enqueue(s).',
        'While Q is not empty:',
        '  curr = dequeue(). Print or process curr.',
        '  For each adjacent vertex v of curr:',
        '    If visited[v] == false: set visited[v] = true and enqueue(v).'
      ]
    },
    cCode: {
      title: 'BFS Traversal using Adjacency Matrix in C',
      code: `#include <stdio.h>
#define MAX 5

int adj[MAX][MAX] = {
    {0, 1, 1, 0, 0}, // 0 connected to 1, 2
    {1, 0, 0, 1, 1}, // 1 connected to 0, 3, 4
    {1, 0, 0, 0, 0}, // 2 connected to 0
    {0, 1, 0, 0, 0}, // 3 connected to 1
    {0, 1, 0, 0, 0}  // 4 connected to 1
};

int visited[MAX] = {0};
int queue[MAX], front = 0, rear = 0;

void bfs(int startVertex) {
    visited[startVertex] = 1;
    queue[rear++] = startVertex;
    
    printf("BFS Order: ");
    while (front < rear) {
        int curr = queue[front++];
        printf("%d ", curr);
        
        for (int neighbor = 0; neighbor < MAX; neighbor++) {
            if (adj[curr][neighbor] == 1 && !visited[neighbor]) {
                visited[neighbor] = 1;
                queue[rear++] = neighbor;
            }
        }
    }
    printf("\\n");
}

int main() {
    bfs(0);
    return 0;
}`,
      isCompilable: true,
      sampleInput: 'Graph with 5 vertices, start at 0',
      expectedOutput: 'BFS Order: 0 1 2 3 4'
    },
    lineExplanations: [
      {
        line: 23,
        code: 'if (adj[curr][neighbor] == 1 && !visited[neighbor])',
        explanation: 'Verifies an edge exists between curr and neighbor, and that neighbor has not already been queued.'
      }
    ],
    complexity: {
      timeBest: 'O(V + E) with Adjacency List; O(V²) with Matrix',
      timeAverage: 'O(V + E)',
      timeWorst: 'O(V + E)',
      space: 'O(V) - Visited array and queue storage',
      reasoning: 'Every vertex is enqueued once and every edge is inspected once (or twice in undirected graph).',
      hinglishReasoning: 'Har vertex queue mein ek baar jata hai aur har edge check hoti hai, isliye time O(V + E) hai.'
    },
    examAnswers: [
      {
        marks: 5,
        question: 'Differentiate between BFS and DFS in tabular form.',
        answer: 'Feature | BFS (Breadth First Search) | DFS (Depth First Search)\n---|---|---\nData Structure | Queue (FIFO) | Stack (LIFO) or System Call Stack\nSearch Direction | Explores level by level (horizontally) | Explores depth first along single path (vertically)\nShortest Path | Guarantees shortest path in unweighted graphs | Does not guarantee shortest path\nSpace Complexity | O(V) - Can be large when branching factor is high | O(h) - Proportional to maximum recursion path height\nBacktracking | No backtracking needed | Heavy backtracking when dead end is reached\nApplications | Shortest path, web crawlers, GPS navigation | Cycle detection, topological sort, maze solving',
        keyPoints: [
          'Queue vs Stack data structure',
          'Level-by-level vs Branch depth exploration',
          'Unweighted shortest path guarantee for BFS',
          'Table of differences for full marks'
        ]
      }
    ],
    commonMistakes: [
      {
        mistake: 'Forgetting to mark a vertex as visited when pushing into the queue.',
        whyItHappens: 'Marking visited only when dequeuing allows duplicates to be enqueued multiple times.',
        howToFix: 'Always set visited[v] = true IMMEDIATELY when pushing to queue.'
      }
    ],
    quickQuestions: [
      {
        id: 'q-grp-1',
        type: 'mcq',
        question: 'Which data structure is fundamentally used to implement Breadth-First Search?',
        options: ['Stack', 'Queue', 'Priority Queue', 'Binary Tree'],
        correctAnswer: 1,
        explanation: 'BFS explores vertices in FIFO order, requiring a Queue.',
        difficulty: 'Easy',
        unit: 5,
        topicId: 'graph'
      }
    ]
  },

  {
    id: 'u5-mst-dijkstra',
    unitId: 5,
    title: 'Minimum Spanning Trees (Prim/Kruskal) & Dijkstra\'s Shortest Path',
    subtitle: 'Greedy Strategy, Edge Relaxation, Cut Property & Cycle Detection',
    category: 'core',
    readTimeMin: 12,
    visualizerType: 'graph',
    whatIsIt: {
      english: 'A Spanning Tree of a connected weighted graph connects all V vertices using exactly V - 1 edges without any cycles. A Minimum Spanning Tree (MST) minimizes total edge weight. Prim\'s algorithm builds an MST by growing a single tree from a starting vertex, while Kruskal\'s algorithm sorts all edges and adds the lowest-weight edges that do not form a cycle. Dijkstra\'s algorithm finds the shortest path from a single source to all vertices using greedy edge relaxation.',
      hinglish: 'Spanning Tree saare vertices ko bina cycle banaye V - 1 edges se jodta hai. MST wo spanning tree hai jiska total weight sabse kam ho. Prim ek vertex se tree badhata hai, Kruskal edges ko sort karke choti edges uthata hai. Dijkstra single source se sabhi nodes ka shortest distance nikalta hai.'
    },
    beginnerGlossary: [
      {
        term: 'Edge Relaxation',
        explanation: 'In Dijkstra: if dist[u] + weight(u, v) < dist[v], update dist[v] = dist[u] + weight(u, v).',
        hinglishExplanation: 'Agar u ke raste se v tak aana pehle se sasta pad raha hai, toh naya chota distance update kar do.'
      },
      {
        term: 'Cycle Detection in Kruskal',
        explanation: 'Using Disjoint Set Union (DSU / Find-Union) to ensure adding an edge does not connect two vertices already in the same component.',
        hinglishExplanation: 'Yeh check karna ki do vertices pehle se aapas mein jude toh nahi hain.'
      }
    ],
    analogy: {
      title: 'Wiring Electricity to Villages vs GPS Navigation',
      english: 'Kruskal and Prim are like an electrical company laying power cables to connect 10 villages: you want every village electrified using the absolute minimum total kilometers of expensive copper wire! Dijkstra is Google Maps finding the quickest driving route from your home to college.',
      hinglish: 'Kruskal aur Prim Bijli vibhag jaise hain jo sabhi gaon ko bijli ke taar se jodna chahta hai sabse kam kharche mein. Dijkstra aapka Google Maps hai jo college pahunchne ka sabse chota rasta batata hai.'
    },
    algorithm: {
      title: 'Dijkstra\'s Single-Source Shortest Path',
      steps: [
        'Set dist[src] = 0 and dist[v] = INFINITY for all other vertices v.',
        'Create a set of unvisited vertices Q containing all vertices.',
        'While Q is not empty:',
        '  Pick vertex u with minimum dist[u] among unvisited nodes.',
        '  Mark u as visited (remove from Q).',
        '  For each neighbor v of u: relax edge: if dist[u] + weight(u, v) < dist[v], then dist[v] = dist[u] + weight(u, v).'
      ]
    },
    cCode: {
      title: 'Dijkstra\'s Algorithm in C using Adjacency Matrix',
      code: `#include <stdio.h>
#define V 5
#define INF 99999

int minDistance(int dist[], int visited[]) {
    int min = INF, min_index = -1;
    for (int v = 0; v < V; v++) {
        if (!visited[v] && dist[v] <= min) {
            min = dist[v];
            min_index = v;
        }
    }
    return min_index;
}

void dijkstra(int graph[V][V], int src) {
    int dist[V], visited[V];
    for (int i = 0; i < V; i++) {
        dist[i] = INF;
        visited[i] = 0;
    }
    dist[src] = 0;
    
    for (int count = 0; count < V - 1; count++) {
        int u = minDistance(dist, visited);
        visited[u] = 1;
        
        for (int v = 0; v < V; v++) {
            if (!visited[v] && graph[u][v] && dist[u] != INF 
                && dist[u] + graph[u][v] < dist[v]) {
                dist[v] = dist[u] + graph[u][v]; // Relaxation
            }
        }
    }
    
    printf("Vertex \\t Distance from Source (%d)\\n", src);
    for (int i = 0; i < V; i++) printf("%d \\t %d\\n", i, dist[i]);
}

int main() {
    int graph[V][V] = {
        {0, 4, 2, 0, 0},
        {4, 0, 1, 5, 0},
        {2, 1, 0, 8, 10},
        {0, 5, 8, 0, 2},
        {0, 0, 10, 2, 0}
    };
    dijkstra(graph, 0);
    return 0;
}`,
      isCompilable: true,
      sampleInput: 'Graph with 5 vertices, src = 0',
      expectedOutput: 'Vertex \t Distance from Source (0)\n0 \t 0\n1 \t 3\n2 \t 2\n3 \t 8\n4 \t 10'
    },
    lineExplanations: [
      {
        line: 28,
        code: 'dist[v] = dist[u] + graph[u][v];',
        explanation: 'Edge relaxation: updates distance to v if traveling through u is strictly shorter than previous best known distance.'
      }
    ],
    complexity: {
      timeBest: 'O(V²) with Matrix; O((V + E) log V) with Min-Heap',
      timeAverage: 'O((V + E) log V)',
      timeWorst: 'O(V²)',
      space: 'O(V) - Stores dist, visited, and predecessor arrays',
      reasoning: 'With min-priority queue, extracting minimum vertex takes O(log V) and each edge relaxation takes O(log V).',
      hinglishReasoning: 'Priority queue use karne par Dijkstra O(E log V) mein chalta hai jo bade graphs ke liye bahut fast hai.'
    },
    examAnswers: [
      {
        marks: 5,
        question: 'Compare Prim\'s and Kruskal\'s algorithms for Minimum Spanning Trees.',
        answer: 'Aspect | Prim\'s Algorithm | Kruskal\'s Algorithm\n---|---|---\nStrategy | Grows a single tree node-by-node from a root | Grows a forest of trees by picking global smallest edges\nPreferred For | Dense Graphs (many edges, E ≈ V²) | Sparse Graphs (few edges, E ≈ V)\nData Structure | Priority Queue / Adjacency Matrix | Disjoint Set Union (DSU / Find-Union) + Edge List\nCycle Check | Automatically avoids cycles by adding outside nodes | Explicit cycle checking required (via DSU)\nTime Complexity | O(V²) with matrix or O(E log V) with heap | O(E log E) or O(E log V) due to edge sorting',
        keyPoints: [
          'Node-growing vs Edge-picking approach',
          'Dense graphs (Prim) vs Sparse graphs (Kruskal)',
          'DSU cycle check requirement in Kruskal',
          'Complexity comparison'
        ]
      }
    ],
    commonMistakes: [
      {
        mistake: 'Applying Dijkstra\'s algorithm on graphs with negative edge weights.',
        whyItHappens: 'Not realizing Dijkstra greedily locks visited nodes and assumes costs only increase.',
        howToFix: 'Dijkstra FAILS with negative edge weights! Use Bellman-Ford algorithm instead.'
      }
    ],
    quickQuestions: [
      {
        id: 'q-mst-1',
        type: 'mcq',
        question: 'A connected graph with V vertices has how many edges in its Spanning Tree?',
        options: ['V', 'V - 1', 'V + 1', '2V'],
        correctAnswer: 1,
        explanation: 'Any tree with V vertices contains exactly V - 1 edges. Adding any edge creates a cycle; removing any edge disconnects the tree.',
        difficulty: 'Easy',
        unit: 5,
        topicId: 'graph'
      }
    ]
  }
];
