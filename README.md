# Triple Frontend Monorepo

트리플 프론트엔드 공용 컴포넌트 및 라이브러리의 [Monorepo](https://en.wikipedia.org/wiki/Monorepo)입니다.

[Lerna](https://lerna.js.org/)를 이용해서 작업하고 있습니다.

## 소개

프론트엔드 관련 프로젝트 중 애플리케이션 프로젝트에 속하지 않는 공용 컴포넌트 및
라이브러리 프로젝트를 이 저장소에 모아서 관리합니다. 애플리케이션 프로젝트들은
유연한 비즈니스 요구사항 대응을 위해 별도 저장소로 운영해서, 버전 충돌을 피하고
비교적 단순한 배포 주기를 가져갈 수 있도록 합니다.

이 저장소에 속한 패키지들은 npm의 `@titicaca` 조직이 포함합니다.

### 기능 요청 및 문의

Slack `@frontend` 그룹, `#triple-web-dev` 채널 및 GitHub `@frontend` 팀

### Project Structure

- `docs/`: [Storybook](https://storybook.js.org)으로 생성하는 Documentation page
- `packages/`: npm에 배포하는 트리플 프론트엔드 패키지

### Package Versioning

모든 패키지를 동시에 같은 버전으로 릴리즈합니다. 버저닝 방식은 하위 패키지 전체를
아우르는 [Semantic Versioning](https://semver.org)을 사용합니다: `MAJOR.MINOR.PATCH`로
버저닝하며, 아래 설명을 참고하여 해당하는 버전을 올립니다.

> 1.  `MAJOR` version when you make incompatible API changes,
> 2.  `MINOR` version when you add functionality in a backwards compatible manner, and
> 3.  `PATCH` version when you make backwards compatible bug fixes.

#### Versioning by Examples

- 특정 패키지에 기능 추가: 인터페이스 변경 없이 특정 패키지의 기능이
  추가되었다면 `MINOR` 버전을 올립니다.
- 패키지 추가: 다른 패키지에 영향이 없는 범위에서 패키지가 추가되었다면 기능
  추가로 볼 수 있고, `MINOR` 버전을 올립니다.
- 패키지 분리: 분리 대상인 패키지의 인터페이스에 변경이 일어납니다. 해당
  패키지를 이용하는 프로젝트들에 코드 변경이 필요하기 때문에 `MAJOR` 버전
  올림에 해당합니다.
- 인터페이스 개선: 인터페이스 변경이 하위 호환을 보장하는지 여부에 따라서
  `MAJOR` 혹은 `MINOR` 버전 올림에 해당합니다.
- 버그 수정: 인터페이스 변경이 없는 버그 수정은 `PATCH` 버전 올림입니다.

### Documentation

[Triple Frontend Documentation](https://frontend-docs.dev.admin.triple-corp.com) 페이지에서 컴포넌트
목록과 뷰, 동작을 볼 수 있습니다. `master` 브랜치에 변경 사항을 푸시할 때마다
페이지를 업데이트합니다.

### CI/CD

- GitHub Actions를 이용해 CI/CD를 수행합니다.
- CI: 모든 PR 이벤트마다 동작합니다.
- CD: 슬랙의 `/release triple-frontend` 커맨드로 트리거합니다.

### History

많은 1.0 버전 이전의 변경사항은 [triple-design-system](https://github.com/titicacadev/triple-design-system)
저장소의 PR 및 코멘트를 참조해야 할 수 있습니다.

## 기여

프로젝트 기여자들이 작업하는데 필요한 준비 및 작업 과정을 설명합니다.

### Prerequisites

- NodeJS 10 이상 (12 이상 및 최신 버전 추천)
- Lerna (`npm install -g lerna`)

### Setup

프로젝트를 클론합니다:

```sh
$ git clone git@github.com:titicacadev/triple-frontend.git && cd triple-frontend
```

디펜던시를 설치합니다:

```sh
$ npm install
```

#### npm@7 or above

[NPM Workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces) 에 의해
root의 `node_modules` 디렉토리 밑에 Symlink로 패키지들이 링크됩니다.

```sh
$ ls -l node_modules/@titicaca
total 0
lrwxr-xr-x   1 inbeom  staff   27 Dec 27 10:47 action-sheet -> ../../packages/action-sheet
lrwxr-xr-x   1 inbeom  staff   25 Dec 27 10:47 ad-banners -> ../../packages/ad-banners
lrwxr-xr-x   1 inbeom  staff   25 Dec 27 10:47 app-banner -> ../../packages/app-banner
lrwxr-xr-x   1 inbeom  staff   35 Dec 27 10:47 app-installation-cta -> ../../packages/app-installation-cta
lrwxr-xr-x   1 inbeom  staff   21 Dec 27 10:47 author -> ../../packages/author
...
```

#### npm < 7

Workspaces를 이용하지 못하는 환경인 경우 [Lerna bootstrap](https://github.com/lerna/lerna/tree/master/commands/bootstrap)
커맨드로 개발 환경을 구성합니다:

```sh
$ lerna bootstrap
...
```

개별 패키지의 `node_modules`(`packages/*/node_modules`) 디렉토리에 개별 패키지의
의존성 트리가 구성됩니다.

### Workflow

#### 기능 추가

1. 작업자가 코드 기여
   - (npm < 7) 디펜던시에 변경이 있는 경우 `lerna bootstrap` 실행 필요
2. 커밋 & 푸시
3. PR 생성 & 리뷰
4. 버전 생성 (Optional): `npm run version` (경우에 따라 PR과 함께 혹은 별도로 생성)
5. master 머지
6. `/release` 커맨드로 배포
7. 배포 (Optional): CD에서 패키지 publish, npm 페이지 통해서 확인

#### 패키지 추가

1. `lerna create [패키지명]` 커맨드로 패키지 추가
2. 적절한 `package.json` 및 `tsconfig.json` 수정 및 생성
3. (npm < 7) 프로젝트 루트에서 `lerna bootstrap` 커맨드 실행으로 디펜던시 링크
4. `src`에 코드 작성
5. 버전 생성 (Optional): 기존 패키지에서 분리가 일어나서 API 인터페이스에
   변경이 있었다면 MAJOR, 기존 패키지와 관련 없는 패키지 추가라면 MINOR 버전
   올림
   - `npm run version -- major`
   - `npm run version -- minor`
6. 커밋 & 푸시
7. PR 생성 & 리뷰
8. master 머지
9. `/release` 커맨드로 배포
10. 배포 (Optional): CD에서 패키지 publish, npm 페이지 통해서 확인

### Testing

각 패키지별 유닛 테스트를 추가할 예정입니다.

### Review

- 모든 PR 리뷰는 GitHub의 `@frontend` 팀에게 자동으로 할당됩니다.
- 팀 멤버 2인 이상이 승인해야 머지할 수 있습니다.
- 머지 전 머지 체크리스트를 모두 확인해야 합니다.

### 배포하기

1. 최신 기본 브랜치에서 릴리즈용 브랜치를 만듭니다.
2. `npm run version` 커맨드로 새로운 버전을 만듭니다.
3. 새로운 버전의 마일스톤이나 커밋 히스토리를 참고하여 CHANGELOG를 작성합니다.
4. Pull Request를 생성하여 변경 내역을 기본 브랜치로 머지합니다.
5. `#triple-web-dev-notifications` 채널에서 `/release triple-frontend main`을 입력하여 CD를 실행합니다.
6. minor 버전 배포였다면, 다음 minor 버전의 마일스톤을 생성합니다.

### 주의사항

- npm Workspaces를 이용하지 않는 경우, 새로운 패키지를 추가하거나 패키지 간
  의존성 그래프가 바뀌면 반드시 `lerna bootstrap` 커맨드로 의존성을 바로잡아야
  합니다.
- Docs를 비롯한 패키지 내에서 다른 패키지를 import하는 경우, 대상 패키지를
  빌드한 이후에만 의도한 동작을 수행할 수 있습니다.
- 뷰 및 기능에 변경이 있는 기여인 경우, docs 페이지도 그에 준하게 업데이트해야
  합니다.
- CHANGELOG 반영이 필요한 경우, PR에 포함하여 CHANGELOG를 작성해야 합니다.
