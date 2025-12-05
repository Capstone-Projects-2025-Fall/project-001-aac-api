# Unit Tests

### Our testing framework: Vitest
Vitest is a modern, fast, and feature rich testing
framework that integrates with Typescript and our development 
environment.
---
### Why Vitest?
- **Mocking Capabilities**: As a client side library that interacts
    heavily with browser APIs, the ability to mock these dependencies
    a necessity. Provides an intuitive mocking system (```vi.mock()```, ```vi.fn()```).
    As seen in tests we use this to mock browser APIs like ```AudioContext``` 
    and ```navigator.mediaDevices```. This allows us to test logic in 
    testable units without a live browser environment. 
- **Module Mocking**: The API is made up of classes that interact with each other.
  Vitest module mocking allows us to replace entire classes with mocked versions of themselves,
  allowing testing of each classes _individual_ logic.
- **TypeScript Support & Performance**: Vitest offers support for Typescript
    with minimal configuration. Also built on top of vite with is fast (APIs bundler 
    of choice is also vite). 
---
#### Suitability for AACcommodate  
- Given that AACcommodate is a client side library with complex internal
logic and dependencies on browser specific functions, Vitest is an ideal choice.
Powerful mocking, Typescript support, and Vite bundling are the primary reason 
for its suitability. This ensure AACcommodate can be a dependable tool for developers.
--- 

#### Testing Coverage Report 
*This is auto generated on every pull request against main with passing test in our Github actions CI/CD Pipeline*

<iframe
    src="/project-001-aac-api/coverage/index.html"
    style={{
    width: '100%',
    height: '800px',
    border: '1px solid #ddd',
    borderRadius: '8px'
    }}
/>