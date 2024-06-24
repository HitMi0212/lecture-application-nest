## [2주차 과제] 특강 신청 서비스

### 요구사항

-   특정 userId를 사용하여 선착순으로 신청
-   각 강의는 선착순 30명만 신청 가능
-   동일한 신청자는 한 번의 수강 신청만 가능
-   어떤 유저가 신청했는지 히스토리 저장
-   특정 userId로 특강 신청 완료 여부 조회
    -   특강 신청에 성공한 사용자는 성공, 명단에 없는 경우는 실패 반환

---
`GET /lectures` - 특강 선택\
`GET /lectures/application/{userId}` - 특강 신청 완료 여부 조회\
`POST /lectures/apply` - 특강 신청

---
### ERD
![image](https://github.com/HitMi0212/hhplus-tdd-nest-week2/assets/94663222/b03ef31f-5ec5-44d7-8512-3c42bd92a0e9)
