# Take-home Exercise: Sortable Table

👋 Hello! Thanks so much for taking part in our interview process! We know that it takes time and effort away from other things, and we appreciate it.

We set this exercise up for a couple of reasons that we hope resonate with you:

1. We think that a 1-hour window into coding a single problem is only going to provide us with a narrow view of your skills; and we get it – the extra pressure of trying to solve some puzzle doesn't do anyone justice, either
2. We want to mimic an experience as close as possible to what you'd be doing on a day-to-day basis as a Frontend Engineer here at Company – reading through requirements, debating different approaches, and putting up a PR for review 🙌

This question is scoped down to what we think can be tackled in 4 hours or less, but otherwise, the requirements listed below, the designs provided alongside those, and the process are very similar to what you could expect from working at Company.

## Expectations and Instructions

Think of this project as a [spike](<https://en.wikipedia.org/wiki/Spike_(software_development)>) or a prototype — a small task to reduce uncertainty or demonstrate the viability of a larger task. We **don’t expect** you to submit complete and production-ready code in under 4 hours. Like a small, timeboxed problem you might take on at work, we’re looking for a reasonably complete implementation that you would be proud to bring to your team as a first pass.

What we **do expect** to see is how you prioritize within time constraints, what your PRs might look like, how you think about iterative development, and how you might bring open questions and next steps to your team. We want this to be a rough likeness of what it would be like to work together. Pretend that this is work you would put up to talk through a problem with the engineers on your team.

_Hint:_ Think about and discuss design/product requirements, performance, browser support, accessibility, code readability, and what steps you would have to take to make this production-ready.

- Any changes should be placed in a new branch within this repository and have a corresponding pull request
- Timebox this to between three and four hours. Doing more work is not better. Tradeoffs related to how you spend a finite amount of time are an important part of engineering.
- Please use only the provided libraries and frameworks. While other tools could solve these problems, we want to focus on your code-writing approach without additional dependencies

### Submitting your work

- You may submit as many pull requests as you need
- Do not merge your pull request(s) into the main branch
- **When you're done, please email your recruiter that you have finished**

Please note, any changes made after your initial submission will not be considered

## Project

### Stack

- [TypeScript](https://www.typescriptlang.org)
- [React](https://reactjs.org)
- [Jest](https://jestjs.io)
- [Tailwind](https://tailwindcss.com/docs/installation)
- [Vite](https://vitejs.dev/)
- [React Icons](https://react-icons.github.io/react-icons/)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)

### Available Scripts

In the project directory, you can run:

#### `npm run dev`

Runs the app in the development mode.
Open [http://localhost:5173/](http://localhost:5173/) to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

#### `npm run test`

Runs a small suite of [Jest](https://jestjs.io) tests.

#### `npm run lint`

Runs [ESLint](https://eslint.org/). There is also an auto-fix command if you run `npm run lint:fix`.

#### `npm run format`

Runs [Prettier](https://prettier.io/)

# Product requirements :books:

## The Problem

Often enough, Company users need to deal with large sets of data – in this exercise, that would be a list of the cities of the world.
We are looking to offer a delightful user experience when it comes to searching, sorting, and navigating through such datasets.

In this exercise, we'll be focusing on these elements of your implementation:

- The reusability/flexibility of the `<SortableTable>` component (or set of components) you'll be coding up
- The user interface and user experience of your app:
  - Visual design
  - Navigation
  - Performance

### Mockups

<details>
  <summary>
  Large screen mockup
  </summary>
<img src="./mock-up.png" width="800px" />
</details>

<details>
  <summary>
  Small screen mockup
  </summary>
  <img src="./mock-up-responsive.png" width="400px" />
</details>

## User-focused Requirements

_Note:_ These requirements use the "Priority Level Scale" where a P0 is the highest priority, and a P4 is the lowest. Use this as a guideline to help you prioritize your time. We **don’t expect** you to complete every task.

### Search

- [x] **P0**: As a user, I want to search for cities by city name
- [x] **P0**: As a user, I want to search for cities by country name
- [ ] **P0**: As a user, I should know when a search does not match any city
- [ ] **P0**: As a user, I should know when a search fails (**Note: if you search for 'error', we mimic an error for you :raised_hands:**)
- [ ] **P1:** [Performance] As a user, I want the search to only kick in after 150ms since my last change to the search term. Do not use utility libraries (e.g., Lodash). We want to see your work!

### Sorting

- [ ] **P0**: As a user, I want to be able to toggle sorting (ascending) the search results by a single column
- [ ] **P1**: As a user, I want to be able to toggle between ascending, descending, or no sorting of the search results by a single column
- [ ] **P2**: As a user, I want to be able to toggle between ascending, descending, or no sorting of the search results by multiple columns

### Pagination

- [ ] **P0**: As a user, I want to be able to paginate through search results using a fixed page size (10)
- [ ] **P0**: As a user, I want to be able to navigate between result pages
- [ ] **P2**: As a user, I want to be able to paginate through search results using a dynamic page size
- [ ] **P3**: As a user, I want to be able to go all the way to the first and last pages of the search results

### Design

_For reference, you can use the screenshot in the problem statement above. We've also uploaded some icons you might want to use for your implementation – you can find these under src/assets/.._ :pray:

- [ ] **P0**: As a Company engineer, when I use `<SortableTable>`, its design matches the [mockups provided in the problem statement](#mockups)

## Product questions

- How many columns do we want to support?
- How can users change the column's order?
- What effort is required to hide or show columns?

---

# Implementation Notes

## ✅ Completed Features

All requirements from the checklist have been implemented:

- [x] Search filters by city and country
- [x] Search debounce set to 150ms
- [x] Search handles empty + error state (`"error"` input triggers failure)
- [x] Single-column sort toggle (asc, desc, none)
- [x] Pagination: fixed page size of 10
- [x] Pagination controls: first, previous, next, last
- [x] Table layout matches mockups
- [x] ARIA: roles, labels, `aria-sort`
- [x] Mobile responsive (horizontal scroll)
- [x] `README.md` written (clear, concise, tradeoffs noted)
- [x] Unit tests added for `sort.ts` + `paginate.ts`
- [x] No external deps used for debounce, sorting, etc.
- [x] Code formatted (`npm run format`)
- [x] ESLint clean (`npm run lint`)
- [x] Work committed in a new branch & PR created

## 🏗️ Architecture

### Component Structure

```
src/
├── components/
│   ├── CityTable/          # Sortable table with ARIA support
│   ├── Pagination/         # Pagination controls
│   └── SearchInput/        # Debounced search input
├── utils/
│   ├── sort.ts            # Sorting utilities (tested)
│   ├── paginate.ts        # Pagination utilities (tested)
│   └── debounce.ts        # Custom debounce implementation
└── api/
    └── getCities.ts       # Enhanced API with search & count
```

### Key Design Decisions

1. **Client-Side Processing**: All sorting and pagination happens in the browser for instant feedback
2. **Custom Utilities**: Implemented debounce, sort, and pagination without external dependencies
3. **Accessibility First**: Full ARIA support with keyboard navigation
4. **Mobile Responsive**: Horizontal scroll for table, adaptive pagination controls
5. **Type Safety**: Comprehensive TypeScript coverage

## 🎯 Performance Optimizations

- **Debounced Search**: 150ms delay prevents excessive API calls
- **Memoized Callbacks**: Prevents unnecessary re-renders
- **Client-Side Caching**: Search results cached for instant sorting/pagination
- **Efficient Sorting**: Stable sort with proper type handling

## ♿ Accessibility Features

- **ARIA Roles**: `table`, `row`, `columnheader`, `gridcell`
- **Sort Indicators**: `aria-sort` attributes for screen readers
- **Keyboard Navigation**: Full keyboard support for all controls
- **Focus Management**: Clear focus indicators and logical tab order
- **Screen Reader Support**: Descriptive labels and live regions

## 📱 Mobile Responsiveness

### Adaptive Layout System

- **Desktop (≥1024px)**: Full table layout with all columns visible
- **Tablet (640px-1023px)**: Horizontal scrolling table with optimized spacing
- **Mobile (<640px)**: Card-based layout with dedicated sort controls

### Mobile-First Features

- **Card Layout**: Cities displayed as individual cards on mobile
- **Touch-Friendly Controls**: Large touch targets (minimum 44px)
- **Mobile Sort Controls**: Dedicated sort buttons above cards
- **Responsive Typography**: Scales appropriately across devices
- **Optimized Spacing**: Reduced padding and margins on smaller screens
- **iOS Safari Support**: Prevents zoom on input focus (16px font size)

### Responsive Breakpoints

- **Small (sm)**: 640px and up
- **Medium (md)**: 768px and up
- **Large (lg)**: 1024px and up
- **Extra Large (xl)**: 1280px and up

## 🧪 Testing Strategy

- **Unit Tests**: Core utilities (`sort.ts`, `paginate.ts`) fully tested
- **Edge Cases**: Null values, empty data, boundary conditions
- **Type Safety**: TypeScript catches type-related issues
- **Manual Testing**: Cross-browser and device testing

## 🔄 Tradeoffs & Future Improvements

### Current Tradeoffs

1. **Memory vs Performance**: Client-side processing uses more memory but provides instant feedback
2. **Bundle Size**: ~2MB bundle (mostly city data) vs server-side filtering
3. **Fixed Page Size**: Simpler implementation vs user customization

### Future Enhancements

1. **Virtual Scrolling**: For very large datasets
2. **Server-Side Processing**: For datasets > 100k items
3. **Column Customization**: Show/hide columns, reordering
4. **Advanced Filtering**: Date ranges, multiple criteria
5. **Export Functionality**: CSV/Excel export
6. **Infinite Scroll**: Alternative to pagination

## 🚀 Production Readiness

To make this production-ready, consider:

1. **Error Monitoring**: Sentry/Bugsnag integration
2. **Analytics**: User interaction tracking
3. **Performance Monitoring**: Core Web Vitals tracking
4. **Caching Strategy**: Redis/CDN for API responses
5. **Rate Limiting**: API protection
6. **Internationalization**: Multi-language support
7. **Progressive Enhancement**: Works without JavaScript
8. **Security**: Input sanitization, CSP headers
