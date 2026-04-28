# CDRI Front-end 사전과제 (cdri-books-kangjae.choi)

## 개요

CDRI Front-end 개발자 채용 과제로 구현한 도서 검색 애플리케이션입니다.

Kakao Books API를 이용해 도서를 검색하고, 검색 결과에서 도서 상세 정보를 확인하거나 원하는 책을 찜할 수 있습니다. 찜한 책은 브라우저에 저장되어 새로고침 후에도 유지되며, 별도의 "내가 찜한 책" 페이지에서 다시 확인할 수 있습니다.

구현하면서 가장 신경 쓴 부분은 단순히 API 결과를 화면에 뿌리는 것보다, 검색/목록/찜하기처럼 반복해서 쓰일 수 있는 기능을 작게 나누고 재사용 가능한 컴포넌트로 정리하는 것이었습니다. 과제 규모는 크지 않지만 실제 서비스 코드로 확장해도 흐름을 따라가기 쉽도록 페이지, API, query, store, UI 컴포넌트의 책임을 분리했습니다.

### 주요 기능

- Kakao Books API 기반 도서 검색
- 제목, 저자명, 출판사 기준 상세 검색
- 검색어 히스토리 저장 및 삭제
- Intersection Observer 기반 무한 스크롤
- 도서 상세 정보 펼치기/접기
- 도서 찜하기 및 찜한 도서 목록 페이지
- localStorage persist 상태의 hydration 처리

### 사용한 기술

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- TanStack Query 5
- Zustand
- React Hook Form
- Zod
- shadcn / Radix UI 기반 UI 컴포넌트
- Axios
- pnpm

## 실행 방법 및 환경 설정

이 프로젝트는 `pnpm`을 기준으로 실행합니다.

```bash
pnpm install
pnpm dev
```

개발 서버는 기본적으로 `http://localhost:3000`에서 실행됩니다.

Kakao Books API 호출을 위해 루트 경로에 `.env` 파일이 필요합니다.

```bash
NEXT_PUBLIC_KAKAO_REST_API_URL=https://dapi.kakao.com
NEXT_PUBLIC_KAKAO_REST_API_VERSION=v3
NEXT_PUBLIC_KAKAO_REST_API_KEY=발급받은_REST_API_KEY
```

빌드와 린트는 아래 명령어로 확인할 수 있습니다.

```bash
pnpm build
pnpm lint
```

## 폴더 구조 및 주요 코드 설명

```text
src
├── api
│   ├── books.ts
│   └── instance.ts
├── app
│   ├── layout.tsx
│   ├── page.tsx
│   ├── providers.tsx
│   └── likes
│       └── page.tsx
├── components
│   ├── books
│   ├── layouts
│   └── ui
├── hooks
├── queries
├── schemas
├── stores
├── types
└── utils
```

### src/app/page.tsx

도서 검색 메인 페이지입니다. 검색 파라미터를 상태로 가지고 있고, TanStack Query의 `useInfiniteQuery`로 Kakao Books API 페이지네이션을 처리합니다.

검색 결과는 `pages` 데이터를 `flatMap`해 하나의 목록으로 만들고, 다음 페이지 요청은 공용 `List` 컴포넌트의 `onEndReached` 콜백으로 연결했습니다. 페이지 컴포넌트 안에서는 "어떤 데이터를 보여줄지"에 집중하고, 실제 목록 렌더링과 무한 스크롤 감지는 `List`로 분리했습니다.

### src/app/likes/page.tsx

찜한 책 목록 페이지입니다. Zustand persist로 저장한 데이터를 사용하며, React 18에서 도입된 `useSyncExternalStore`를 이용해 persist hydration 완료 여부를 구독합니다.

이 처리를 넣은 이유는 서버 렌더링 시점과 클라이언트 localStorage 복원 이후의 값이 달라질 수 있기 때문입니다. hydration이 끝나기 전에는 로딩 상태를 보여주고, 완료된 뒤 실제 찜 목록을 렌더링해 화면 불일치 가능성을 줄였습니다.

### src/components/list.tsx

검색 결과와 찜 목록에서 함께 사용하는 제네릭 목록 컴포넌트입니다.

`items`, `getKey`, `renderItem`을 props로 받아 데이터 타입에 묶이지 않고 재사용할 수 있게 만들었습니다. 또한 empty state, prefix 영역, loading state, infinite scroll을 옵션으로 받을 수 있어 현재는 도서 목록에 사용하지만 다른 목록 UI로도 확장하기 좋습니다.

무한 스크롤은 `IntersectionObserver`를 사용했고, viewport 하단에 닿기 조금 전에 다음 페이지를 미리 불러오도록 `rootMargin`을 두었습니다.

### src/components/books

도서 도메인에 가까운 컴포넌트를 모아둔 폴더입니다.

- `books-search-form.tsx`: 검색 폼의 provider 역할을 하며 일반 검색과 상세 검색을 묶습니다.
- `books-search-input.tsx`: 검색어 입력, 검색 실행, 검색 히스토리 선택/삭제를 담당합니다.
- `books-detail-search-button.tsx`: Popover 안에서 검색 대상과 검색어를 입력받는 상세 검색 UI입니다.
- `books-item.tsx`: 도서 썸네일, 제목, 저자, 가격, 상세 설명, 구매 링크, 찜하기 액션을 렌더링합니다.
- `books-list-prefix.tsx`: 목록 상단의 타이틀과 검색 결과 수를 표시합니다.

### src/hooks/use-search-history.ts

검색어 히스토리를 localStorage에 저장하는 커스텀 훅입니다.

초기 상태를 만들 때 `useState(readHistory)` 형태의 lazy initializer를 사용했습니다. localStorage 접근은 렌더링 때마다 반복할 필요가 없고, 브라우저 API 접근 비용도 있기 때문에 첫 렌더링에만 읽도록 처리했습니다.

### src/queries/books.ts

Kakao Books API 검색 쿼리 옵션을 관리합니다.

query key와 query function, 다음 페이지 계산 로직을 한곳에 모아 페이지 컴포넌트가 API 세부 구현을 몰라도 되게 했습니다. 검색어가 없을 때는 `enabled: !!params.query`로 불필요한 요청을 보내지 않습니다.

### src/stores/liked-books.ts

찜한 책 상태를 관리합니다.

Zustand와 persist middleware를 사용해 localStorage에 저장합니다. 같은 ISBN을 다시 찜할 경우 중복 저장하지 않고 최신 선택이 목록 상단으로 오도록 처리했습니다.

### src/env.ts

`@t3-oss/env-nextjs`와 Zod를 사용해 환경 변수를 검증합니다.

API URL, API version, Kakao REST API key가 비어 있거나 잘못된 형식이면 런타임에서 더 늦게 실패하기 전에 환경 설정 문제를 먼저 확인할 수 있습니다.

## 라이브러리 선택 이유

### TanStack Query

도서 검색은 서버 상태에 가깝고, 페이지네이션과 로딩 상태가 함께 따라옵니다. 직접 `useEffect`와 `useState`로 요청 상태를 관리할 수도 있지만, 캐싱과 stale time, 다음 페이지 계산, 중복 요청 방지 같은 부분은 TanStack Query가 더 안정적으로 처리해준다고 판단했습니다.

특히 이번 과제에서는 `useInfiniteQuery`를 사용해 Kakao Books API의 `page` 기반 페이지네이션을 자연스럽게 연결했습니다.

### Zustand

찜한 책은 서버에 저장되는 데이터가 아니라 현재 브라우저에 남아 있으면 되는 클라이언트 상태입니다. 전역에서 접근해야 하지만 구조가 복잡하지 않기 때문에 Redux 계열보다 Zustand가 더 가볍고 과제 범위에도 잘 맞았습니다.

persist middleware를 붙여 localStorage 저장까지 store 레벨에서 처리했고, 페이지 컴포넌트는 저장 방식보다 "찜 목록을 어떻게 보여줄지"에 집중하도록 했습니다.

### React Hook Form + Zod

일반 검색과 상세 검색은 UI는 다르지만 둘 다 "검색어가 비어 있으면 안 된다"는 검증 규칙을 공유합니다. React Hook Form으로 입력 상태와 submit 흐름을 관리하고, Zod schema로 검증 규칙을 분리해 폼 로직이 컴포넌트 내부에 흩어지지 않게 했습니다.

이러한 이유 외적으로도 React에서 Form을 다루는 것은 말은 쉽지만, 개발자 입장에서는 꽤나 피곤한 일입니다.(백오피스의 경우 Input만 수십개에 이릅니다.)

이럴 때에 여러개의 필드를 한번에 핸들링하고 검증할 때에는 React Hook Form과 Zod의 조합이 이전 커리어에서 느낀 바, 굉장히 개발자 경험이 좋았습니다. 이러한 이유로 위 조합을 선택하게 되었습니다.

### Radix UI / shadcn

Popover, Select, Button처럼 접근성과 인터랙션 상태를 신경 써야 하는 UI는 검증된 primitive를 기반으로 가져가는 편이 낫다고 생각했습니다. shadcn 스타일의 컴포넌트를 프로젝트에 맞게 직접 소유하는 방식이라, 디자인 요구사항에 맞춰 클래스와 variant를 수정하기도 편했습니다.

### @t3-oss/env-nextjs

환경 변수는 빠뜨려도 TypeScript가 바로 잡아주기 어렵습니다. API 연동에 필요한 값들을 Zod schema로 명시해두면, 배포나 로컬 실행 시 설정 누락을 더 빨리 발견할 수 있습니다.

물론, 환경 변수 검증을 서버 사이드에서 검증해도 괜찮겠지만 환경 변수를 코드에서 일일이 검증하고 값을 확인하는 행위는 리소스 소모가 크다고 판단했습니다.

팀의 리소스 소모를 최소화 할 수 있는 방법은 Map(key-value 쌍) 형태의 데이터를 사용하여 자동으로 검증하도록 하는 것이 장기적으로 도움이 되리라 생각했습니다.

## 강조하고 싶은 기능

### 서버 상태와 클라이언트 상태를 나눠서 관리

검색 결과와 찜한 책은 모두 "상태"로 보이지만 성격이 다르다고 판단했습니다.

검색 결과는 Kakao API에서 받아오는 서버 상태이므로 캐싱, 로딩, 다음 페이지 요청, refetch 정책이 중요합니다. 그래서 TanStack Query로 관리했습니다. 반면 찜한 책은 서버와 동기화할 필요가 없는 사용자 브라우저의 클라이언트 상태이므로 Zustand persist로 가볍게 관리했습니다.

이렇게 상태의 성격에 따라 관리 도구를 나누면 페이지 컴포넌트가 불필요하게 복잡해지지 않고, 나중에 서버 저장 방식이 추가되더라도 수정해야 할 영역을 비교적 명확하게 가져갈 수 있다고 생각했습니다.

### React 18 이후의 API를 실제 문제에 맞게 사용

찜 목록 페이지에서 `useSyncExternalStore`를 사용했습니다. 단순히 최신 API를 써보기 위한 목적이 아니라, Zustand persist가 localStorage를 복원하기 전후로 서버/클라이언트 렌더 결과가 달라질 수 있는 문제를 정리하기 위해 사용했습니다.

`persist.hasHydrated()`를 snapshot으로 읽고 `persist.onFinishHydration()`을 subscribe 함수로 연결해, hydration 완료 전에는 로딩 UI를 보여주고 완료 후 목록을 렌더링합니다. 작은 과제에서도 SSR/CSR 경계에서 생길 수 있는 문제를 의식하고 처리했다는 점을 보여드리고 싶었습니다.

### 재사용 가능한 목록 컴포넌트

`List<T>`는 특정 도메인 타입에 의존하지 않도록 만들었습니다. `renderItem`과 `getKey`만 넘기면 검색 결과 목록과 찜 목록에서 같은 컴포넌트를 사용할 수 있고, infinite scroll이나 empty state도 필요할 때만 켤 수 있습니다.

이 방식은 과제 안에서는 코드 중복을 줄여주고, 실제 서비스에서는 공지사항, 상품 목록, 사용자 목록처럼 다른 리스트 화면으로 확장할 때도 같은 패턴을 가져갈 수 있습니다.

### 무한 스크롤 흐름을 컴포넌트 안으로 캡슐화

무한 스크롤은 페이지마다 직접 `IntersectionObserver`를 붙이는 방식으로 구현하면 금방 중복이 생깁니다. 그래서 observer 생성, sentinel 관리, loading indicator 렌더링은 `List` 컴포넌트가 담당하게 했고, 페이지에서는 다음 페이지를 불러오는 `onEndReached` 함수만 넘기도록 만들었습니다.

검색 결과 페이지는 TanStack Query의 `fetchNextPage`만 연결하면 되고, 찜 목록 페이지는 클라이언트 배열에서 노출 개수만 늘리면 됩니다. 데이터 출처는 다르지만 스크롤 경험은 같은 컴포넌트로 맞출 수 있게 한 점이 장점이라고 생각합니다.

### 검색 경험을 위한 작은 UX 처리

검색어 히스토리는 사용자가 이전 검색어를 다시 선택하거나 삭제할 수 있게 만들었습니다. 또한 일반 검색을 실행하면 상세 검색 상태를 초기화하고, 상세 검색을 실행하면 일반 검색어를 초기화해 현재 어떤 조건으로 검색 중인지 헷갈리지 않도록 했습니다.

검색 히스토리는 첫 렌더링부터 바로 노출하지 않고, 사용자가 검색창을 한 번 focus한 뒤에만 마운트합니다. localStorage 기반 데이터가 SSR 결과와 달라질 수 있는 부분을 피하면서도 사용성은 유지하려고 한 처리입니다.

### 폼 구조를 검색 방식에 맞춰 분리

일반 검색과 상세 검색은 같은 폼 안에 있지만 역할이 다릅니다. `BooksSearchForm`에서 `FormProvider`를 한 번 감싸고, 실제 입력 UI는 `BooksSearchInput`과 `BooksDetailSearchButton`으로 나누었습니다.

이렇게 구성하면 검색 폼 전체의 검증 규칙은 한곳에서 관리하면서도, 각 입력 컴포넌트는 자기 인터랙션에 집중할 수 있습니다. 예를 들어 일반 검색은 검색 히스토리와 연결되고, 상세 검색은 Popover와 Select를 포함하지만 두 컴포넌트 모두 같은 form context를 공유합니다.

### API와 UI 책임 분리

Kakao API 호출은 `api`, query option은 `queries`, API 응답 타입은 `types`, 화면 렌더링은 `components`와 `app`에 나누었습니다. 작은 프로젝트라도 이 경계를 나눠두면 API 스펙 변경이나 UI 변경이 생겼을 때 수정 범위가 줄어듭니다.

예를 들어 Kakao Books API의 기본 파라미터는 `src/api/books.ts`에 모여 있고, 다음 페이지 계산은 `src/queries/books.ts`에 있습니다. 페이지 컴포넌트는 검색 파라미터와 렌더링 흐름만 보면 되기 때문에 유지보수하기 쉽습니다.

### React Compiler 적용

`next.config.ts`에서 React Compiler를 활성화했습니다. 현재 코드에서도 필요한 곳에는 `useMemo`, `useCallback`을 사용하고 있지만, 프레임워크가 제공하는 최신 최적화 흐름을 함께 적용해 렌더링 비용을 줄일 수 있는 방향으로 구성했습니다.

물론, React Compiler의 적용으로 일반 함수 선언식이나 표현식은 컴파일러가 알아서 필요에 따라 Memoization(이하, 메모이제이션) 되겠지만, 필요한 상황에서 적절히 메모이제이션을 할 수 있다는 것을 보여드리고 싶었습니다.
