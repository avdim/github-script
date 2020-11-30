val a = "1"
println(a)

typealias Rule = (packageName: String) -> Boolean

interface VerifyPackages {
  fun addRule(rule: Rule)
}

operator fun VerifyPackages.unaryPlus(rule: Rule)
operator fun VerifyPackages.unaryMinus(rule: Rule)
fun mask(mask: String): Rule = {

}

fun regEx(regEx: String): Rule = {

}

fun all(lambda: VerifyPackages.() -> Unit) {

}

fun any(lambda: VerifyPackages.() -> Unit) {

}

fun verifyPackages(lambda: VerifyPackages.() -> Unit) {

}





// Пример валидации пакетов на языке Kotlin
verifyPackages {
  +mask("**/europe*")
  -mask("**secret**")
  +regEx("/[A-Za-z].*?/")

  +{ packageName: String -> // Лямбда
    // Тут можно написать любой код
    packageName == "concrete_pacakge_name"
    // if, else, for ...
  }

}
