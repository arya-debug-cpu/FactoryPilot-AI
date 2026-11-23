"""Master test suite runner for FactoryPilot ML."""

from __future__ import annotations

import os
import sys
import time
import unittest

_ML_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if _ML_ROOT not in sys.path:
    sys.path.insert(0, _ML_ROOT)


def run_all_ml_tests() -> bool:
    """Discover and execute all unittests in tests/ directory."""
    print("=" * 70)
    print("RUNNING FACTORYPILOT ML COMPREHENSIVE TEST SUITE")
    print("=" * 70)

    start_time = time.time()
    tests_dir = os.path.join(_ML_ROOT, "tests")

    loader = unittest.TestLoader()
    suite = loader.discover(start_dir=tests_dir, pattern="test_*.py")

    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)

    elapsed = round(time.time() - start_time, 2)
    print("\n" + "=" * 70)
    print(f"TEST RESULTS: Ran {result.testsRun} tests in {elapsed}s")
    print(f"Failures: {len(result.failures)}, Errors: {len(result.errors)}, Skipped: {len(result.skipped)}")
    print("=" * 70)

    return result.wasSuccessful()


if __name__ == "__main__":
    success = run_all_ml_tests()
    sys.exit(0 if success else 1)
