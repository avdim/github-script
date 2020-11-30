fun verify(packageName:String):Boolean {

}
fun assertTrue(expect:Boolean, actual:Boolean) {

}
fun assertFalse(expect:Boolean, actual:Boolean) {

}



// Эти тесты будут гоняться на PR в сервис миграции

@Test
fun checkSuccess() {
  assertTrue(
    verify("@tutu/succes-package")
  )
}

@Test
fun checkFail() {
  assertFalse(
    verify("@tutu/secret-package")
  )
}
