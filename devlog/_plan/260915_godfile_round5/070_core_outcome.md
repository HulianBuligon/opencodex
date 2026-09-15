# 070 core.ts 편입 (계획 변경 기록)

000_plan.md 은 `src/server/responses/core.ts` 를 라운드5 범위 밖으로 선언했다. 별도 워크트리에서
다른 에이전트가 담당하고 있었기 때문이다. 그 작업이 완료돼 이 라운드로 편입했으므로 그 선언을 정정한다.

## 무엇이 들어왔는가

`src/server/responses/core.ts` 9,386 -> 210줄. 리프 24개가 `src/server/responses/` 하위에 생겼다.
가장 큰 리프는 `passthrough-dispatch.ts` 1,476줄이고 전부 2,000줄 아래다.

앞선 네 단위와 결정적으로 다른 점이 하나 있다. 나머지는 순수 이동이었지만 이것은 아니다.
`handleResponsesInner` 는 약 5,600줄짜리 단일 함수였고, 그 본문을 13개 처리 구간으로 나눴다.
계정 교체나 재시도 후에도 같은 상태를 보아야 하는 값들은 복사하지 않고 원래 지역 변수에 연결된
getter/setter 로 넘긴다: 전송 예산, adapter, 인증 snapshot, 도구 별칭, 취소 상태, continuation 재시도 횟수.

이 결정이 라운드5 의 `serveOptions` 추출과 같은 성질이다. 거기서도 가변 캡처 3개를 구조 분해하면
스냅샷이 되어 조용히 깨졌다. 여기서는 그 대상이 6종이고, 대상이 하나라도 값 복사로 새면 계정 교체
직후의 재시도가 이전 계정의 예산과 adapter 를 들고 돌아간다.

## 오라클 처리 방식이 더 낫다

라운드5 는 오라클을 손으로 재지정했고 두 번 놓쳤다. bridge 에서는 경로가 조립돼 있어서 리터럴 검색이
못 봤고(CI 에서 `Received value does not have a length property: null`), server/index 에서는 같은 파일
안 세 번째 describe 를 시뮬레이션이 빠뜨렸다.

core.ts 쪽은 `tests/helpers/responses-core-source.ts` 에 모듈 목록을 상수로 두고
`readResponsesCoreSource()` 가 그 전부를 이어 읽는다. 그리고 `tests/responses/core-modules.test.ts` 가
그 목록이 실제 소스 import 그래프와 일치하는지 단언한다. 리프를 추가하고 목록에 넣지 않으면 그 테스트가
실패하므로, 오라클이 조용히 vacuous 해지는 경로가 닫힌다. 다음 라운드는 이 방식을 먼저 쓴다.

## 이 라운드의 최종 상태

| 파일 | 이전 | 이후 |
| --- | ---: | ---: |
| src/adapters/openai-responses.ts | 2,627 | 6 |
| src/bridge.ts | 2,206 | 7 |
| src/server/index.ts | 3,400 | 893 |
| src/server/responses/core.ts | 9,386 | 210 |

이로써 `src/` 의 산출물 제외 2,000줄 이상 파일은 0개가 된다. 산출물은
`src/adapters/cursor/gen/agent_pb.ts`(15,274) 하나이고 ratchet 의 generated 목록에 있다.

## 남은 것

`handleResponsesInner` 는 사라졌지만 그 자리에 1,476줄짜리 `passthrough-dispatch.ts` 가 있다.
2,000줄 게이트는 통과하지만 한 파일이 하나의 일을 한다고 말하기는 어렵다. 다음 라운드의 후보는
줄 수가 아니라 이런 "게이트는 통과하는데 여전히 큰" 리프들이다.

