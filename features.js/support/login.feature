Feature: SauceDemo Login

  @smoke @positive
  Scenario: Login with valid credentials
    Given I open the login page
    When I login with username "standard_user" and password "secret_sauce"
    Then I should see the products page

  @regression @negative
  Scenario: Login with invalid credentials
    Given I open the login page
    When I login with username "invalid_user" and password "wrong_password"
    Then I should see a login error

  @smoke @positive
  Scenario: Login with problem user
    Given I open the login page
    When I login with username "problem_user" and password "secret_sauce"
    Then I should see the products page

  @regression @positive
  Scenario: Login with performance glitch user
    Given I open the login page
    When I login with username "performance_glitch_user" and password "secret_sauce"
    Then I should see the products page

  @regression @negative
  Scenario: Login with empty username
    Given I open the login page
    When I login with username "" and password "secret_sauce"
    Then I should see a login error

  @regression @negative
  Scenario: Login with empty password
    Given I open the login page
    When I login with username "standard_user" and password ""
    Then I should see a login error

  @regression @negative
  Scenario: Login with empty username and password
    Given I open the login page
    When I login with username "" and password ""
    Then I should see a login error

  @regression @negative
  Scenario: Login with username containing spaces
    Given I open the login page
    When I login with username "invalid user" and password "secret_sauce"
    Then I should see a login error

  @regression @negative
  Scenario: Login with locked out user
    Given I open the login page
    When I login with username "locked_out_user" and password "secret_sauce"
    Then I should see a login error

  @regression @negative
  Scenario: Login with valid username and incorrect password
    Given I open the login page
    When I login with username "standard_user" and password "wrong_password"
    Then I should see a login error